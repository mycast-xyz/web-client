<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { SessionService } from '../../service/SessionService';
  export let close: () => void;
  type Bot = { id: string; name: string; icon: string; tokenActive: boolean };
  const api = import.meta.env.VITE_USER_BOT_API || 'https://mycast.xyz:9011/user-bots';
  const controller = new AbortController();
  let bots: Bot[] = [], name = '', icon = '', status = '', busy = false;
  let tokens: Record<string,string> = {}, show: Record<string,boolean> = {};
  async function request(path = '', method = 'GET', body?: unknown) {
    const key = SessionService.getPrivateKey();
    const response = await fetch(api + path, { method, signal: controller.signal,
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined });
    if (controller.signal.aborted || key !== SessionService.getPrivateKey()) throw new Error('로그인 상태가 변경되었습니다.');
    if (response.status === 204) return null;
    let data; try { data = await response.json(); } catch { throw new Error('user-bot 서버 응답을 확인할 수 없습니다.'); }
    if (controller.signal.aborted || key !== SessionService.getPrivateKey()) throw new Error('로그인 상태가 변경되었습니다.');
    if (!response.ok) throw new Error(data.error || '요청을 처리하지 못했습니다.');
    return data;
  }
  async function run(action: () => Promise<void>) {
    if (busy) return; busy = true; status = '';
    try { await action(); } catch (error) { if (!controller.signal.aborted) status = error instanceof Error ? error.message : '요청 실패'; }
    finally { busy = false; }
  }
  async function refresh() { bots = await request(); }
  onMount(() => {
    const unsubscribe = SessionService.subscribePrivateKey(key => { tokens = {}; show = {}; bots = []; if (key) void run(refresh); });
    return unsubscribe;
  });
  onDestroy(() => { controller.abort(); tokens = {}; });
</script>

<div class="veil" role="presentation">
  <section role="dialog" aria-modal="true" aria-label="내 봇" class="user-bot-settings">
    <header><h3><i class="fas fa-bug" /> 내 봇</h3><button on:click={close} aria-label="내 봇 닫기">✕</button></header>
    <p>계정당 최대 3개 봇의 이름·이미지와 토큰을 관리합니다. 채팅에는 봇 아이콘과 소유자 닉네임이 표시됩니다.</p>
    <form on:submit|preventDefault={() => run(async () => {
      await request('', 'POST', { name, icon }); name = ''; icon = ''; await refresh();
    })}>
      <label>이름<input bind:value={name} maxlength="32" required /></label>
      <label>프로필 이미지 URL<input bind:value={icon} type="url" placeholder="https://… (선택)" /></label>
      <button disabled={busy || bots.length >= 3}>봇 만들기</button>
    </form>
    {#each bots as bot (bot.id)}
      <article>
        <label>봇 이름<input bind:value={bot.name} maxlength="32" /></label>
        <label>이미지 URL<input bind:value={bot.icon} type="url" /></label>
        <p>{bot.tokenActive ? '토큰 사용 가능' : '토큰 폐기 또는 만료'}</p>
        <button disabled={busy} on:click={() => run(async () => { await request('/' + bot.id, 'PATCH', {name:bot.name,icon:bot.icon}); status = '저장했습니다.'; })}>프로필 저장</button>
        <button disabled={busy || !bot.tokenActive} on:click={() => run(async () => { tokens[bot.id] = (await request('/' + bot.id + '/token')).token; })}>토큰 조회</button>
        {#if tokens[bot.id]}
          <label>토큰<input readonly type={show[bot.id] ? 'text' : 'password'} value={tokens[bot.id]} autocomplete="off" spellcheck="false" /></label>
          <button on:click={() => show[bot.id] = !show[bot.id]}>{show[bot.id] ? '가리기' : '보기'}</button>
          <button on:click={() => run(async () => { await navigator.clipboard.writeText(tokens[bot.id]); status='복사했습니다.'; })}>복사</button>
        {/if}
        <button disabled={busy} on:click={() => {
          if (confirm('새 토큰을 발급하면 기존 토큰은 사용할 수 없습니다. 재발급할까요?')) void run(async () => {
            tokens[bot.id] = (await request('/' + bot.id + '/token','PUT')).token; await refresh();
          });
        }}>토큰 재발급</button>
        <button disabled={busy || !bot.tokenActive} on:click={() => {
          if (confirm('토큰을 폐기하고 봇의 채팅 연결을 중단할까요?')) void run(async () => {
            await request('/' + bot.id + '/token','DELETE'); delete tokens[bot.id]; tokens={...tokens}; await refresh();
          });
        }}>토큰 폐기</button>
        <button disabled={busy} on:click={() => {
          if (confirm('이 봇을 삭제할까요? 이전 채팅 기록은 유지됩니다.')) void run(async () => {
            await request('/' + bot.id,'DELETE'); delete tokens[bot.id]; tokens={...tokens}; await refresh();
          });
        }}>봇 삭제</button>
      </article>
    {/each}
    <p role="status">{busy ? '처리 중…' : status}</p>
  </section>
</div>
<style>
  .veil { position:fixed; inset:0; z-index:1000; background:#0008; display:flex; align-items:center; justify-content:center; }
  .user-bot-settings { color:var(--primary-foreground-color); background:var(--primary-background-color); width:440px; max-width:calc(100vw - 24px); max-height:85vh; overflow:auto; padding:16px; border-radius:5px; }
  header { display:flex; align-items:center; justify-content:space-between; }
  header h3 { margin:0; } header button { margin:0; }
  label { display:block; font-size:13px; margin:8px 0; }
  input { width:100%; margin:4px 0; color:inherit; background:var(--primary-hoverground-color); }
  article { border-top:1px solid #8885; margin-top:16px; padding-top:12px; }
  p { font-size:13px; margin:8px 0; }
  button { cursor:pointer; margin:3px; padding:6px 9px; color:inherit; background:var(--primary-hoverground-color); border:1px solid #8886; border-radius:3px; }
  button:hover:not(:disabled) { border-color:var(--primary-activeground-color); }
  button:disabled { opacity:.5; cursor:default; }
  form button { background:var(--primary-activeground-color); color:white; }
</style>
