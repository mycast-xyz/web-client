<script lang="ts">
  import { onDestroy } from 'svelte';
  import { SessionService } from '../../service/SessionService';
  import { SocketService } from '../../service/SocketService';
  export let connected: boolean;
  const api = import.meta.env.VITE_VIDEO_API || 'https://mycast.xyz:9011/video';
  let input: HTMLInputElement;
  let file: File | undefined;
  let preview = '';
  let busy = false;
  let progress = 0;
  let status = '';
  let uploaded = '';
  let ticket = '';
  let request: XMLHttpRequest | undefined;
  let controller: AbortController | undefined;
  let uploadKey = '';
  function cancel() {
    controller?.abort();
    request?.abort();
    if (ticket) fetch(api + '/uploads/' + ticket, { method: 'DELETE' }).catch(() => {});
    if (uploaded)
      fetch(uploaded.slice(0, -'/watch'.length), {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + uploadKey }
      }).catch(() => {});
    ticket = '';
    busy = false;
    uploaded = '';
    file = undefined;
    status = '';
    if (preview) URL.revokeObjectURL(preview);
    preview = '';
  }
  onDestroy(cancel);
  function select() {
    const chosen = input.files?.[0];
    input.value = '';
    cancel();
    if (!chosen) return;
    if (!/\.mp4$/i.test(chosen.name) || chosen.size > 50 * 1024 * 1024 || chosen.size === 0) {
      status = '50 MB 이하 MP4 파일을 선택해 주세요.';
      return;
    }
    file = chosen;
    preview = URL.createObjectURL(chosen);
  }
  async function upload() {
    if (!file || busy || !connected) return;
    const selected = file;
    const key = SessionService.getPrivateKey();
    uploadKey = key;
    busy = true;
    progress = 0;
    status = '업로드 준비 중…';
    controller = new AbortController();
    const signal = controller.signal;
    try {
      const policyResponse = await fetch(api + '/policy', { signal });
      if (!policyResponse.ok) throw new Error('서버가 아직 동영상 첨부를 지원하지 않습니다.');
      const policy = await policyResponse.json();
      if (selected.size > policy.maxBytes) throw new Error('서버 파일 크기 제한을 초과했습니다.');
      const response = await fetch(api + '/uploads', {
        method: 'POST',
        signal,
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
        body: JSON.stringify({ name: selected.name, bytes: selected.size })
      });
      const reservation = await response.json();
      if (!response.ok) throw new Error(reservation.error || '업로드를 시작할 수 없습니다.');
      ticket = reservation.token;
      const info: { id: string } = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        request = xhr;
        xhr.open('PUT', api + '/uploads/' + ticket);
        xhr.setRequestHeader('Content-Type', 'application/octet-stream');
        xhr.timeout = 15 * 60 * 1000;
        xhr.upload.onprogress = (e) => {
          progress = Math.min(99, Math.floor((e.loaded / selected.size) * 100));
          status = '업로드 및 영상 검사 중…';
        };
        xhr.onload = () => {
          try {
            const result = JSON.parse(xhr.responseText);
            if (xhr.status === 201) resolve(result);
            else reject(new Error(result.error || '업로드 실패'));
          } catch {
            reject(new Error('업로드 응답을 확인할 수 없습니다.'));
          }
        };
        xhr.onerror = () => reject(new Error('업로드 연결에 실패했습니다.'));
        xhr.onabort = () => reject(new DOMException('취소됨', 'AbortError'));
        xhr.ontimeout = () => reject(new Error('업로드 시간이 초과되었습니다.'));
        xhr.send(selected);
      });
      if (signal.aborted) return;
      uploaded = api + '/' + info.id + '/watch';
      progress = 100;
      status = '업로드 완료. 보내기를 눌러 채팅에 올리세요.';
      ticket = '';
    } catch (e) {
      if (!signal.aborted) status = e instanceof Error ? e.message : '업로드 실패';
    } finally {
      if (!signal.aborted) {
        if (ticket) fetch(api + '/uploads/' + ticket, { method: 'DELETE' }).catch(() => {});
        ticket = '';
        busy = false;
        request = undefined;
      }
    }
  }
  function send() {
    if (!uploaded || !connected || !SessionService.getPrivateKey() || !SocketService.chat) return;
    SocketService.chat?.execute(SessionService.getPrivateKey(), 'chat', uploaded);
    uploaded = '';
    cancel();
  }
</script>

<button
  class="attach"
  type="button"
  title="동영상 첨부"
  aria-label="동영상 첨부"
  disabled={!connected || busy}
  on:click={() => input.click()}
>
  <i class="fas fa-file-video" />
</button>
<input bind:this={input} type="file" accept=".mp4,video/mp4" hidden on:change={select} />
{#if file || status}
  <div class="video-upload" role="region" aria-label="동영상 첨부">
    {#if file}
      <!-- svelte-ignore a11y-media-has-caption -->
      <video src={preview} controls preload="metadata" playsinline />
      <p>{file.name} · {(file.size / 1048576).toFixed(1)} MB</p>
    {/if}
    {#if busy}<progress value={progress} max="100" aria-label="동영상 업로드 진행률" />{/if}
    <p role="status">{status || 'MP4 · H.264/AAC · 최대 50 MB, 3분'}</p>
    {#if file && !uploaded}<button type="button" disabled={busy || !connected} on:click={upload}
        >업로드</button
      >{/if}
    {#if uploaded}<button type="button" disabled={!connected} on:click={send}>보내기</button>{/if}
    <button type="button" on:click={cancel}>취소</button>
  </div>
{/if}

<style>
  .attach {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: top;
    width: 28px;
    height: 30px;
    padding: 0;
    margin: 0;
    font-size: 14px;
    line-height: 1;
    background: none;
    color: inherit;
    border: 0;
    cursor: pointer;
  }
  .attach:hover:not(:disabled) {
    color: var(--primary-activeground-color);
  }
  .video-upload {
    position: absolute;
    bottom: 100%;
    right: 0;
    width: 320px;
    max-width: 85vw;
    padding: 12px;
    z-index: 30;
    background: var(--primary-background-color);
    border: 1px solid var(--primary-borderground-color);
    box-shadow: 0 4px 16px #0007;
  }
  video {
    width: 100%;
    max-height: 180px;
    background: #111;
  }
  p {
    overflow-wrap: anywhere;
    font-size: 13px;
    margin: 8px 0;
  }
  progress {
    width: 100%;
  }
  .video-upload button {
    margin-right: 8px;
    padding: 6px 12px;
  }
</style>
