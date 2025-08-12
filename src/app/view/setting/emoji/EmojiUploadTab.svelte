<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { ToastService } from '../../../service/ToastService';

  const dispatch = createEventDispatcher();

  let imageFile: File | null = null;
  let imagePreview = '';
  let emojiName = '';
  let uploader = 'vega-moderator';
  let uploading = false;
  let fileInput: HTMLInputElement;

  // 드래그 오버 상태 표시용
  let dragOver = false;

  function onDrop(event: DragEvent) {
    console.log(event);
    event.preventDefault();
    dragOver = false;
    if (event.dataTransfer?.files.length) {
      handleFile(event.dataTransfer.files[0]);
    }
  }

  function onDragOver(event: DragEvent) {
    event.preventDefault();
    dragOver = true;
  }

  function onDragLeave(event: DragEvent) {
    event.preventDefault();
    dragOver = false;
  }

  function onFileChange(event: DragEvent) {
    const file = event.target?.files?.[0];
    if (file) {
      handleFile(file);
    }
  }

  function handleFile(file: File) {
    // 이미지 파일인지 확인 (JPEG, PNG, GIF, WEBP)
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('지원하지 않는 파일 형식입니다.');
      return;
    }
    imageFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview = e.target?.result;
    };
    reader.readAsDataURL(file);
  }

  function upload() {
    if (!imageFile) {
      alert('이미지를 선택해주세요.');
      return;
    }
    if (!emojiName.trim()) {
      alert('이모지 이름을 입력해주세요.');
      return;
    }
    uploading = true;

    dispatch('upload', { imageFile, emojiName, uploader });

    // 업로드 완료 가정 (예: 2초 뒤)
    setTimeout(() => {
      uploading = false;
      ToastService.toastText('업로드 완료!');
      reset();
    }, 2000);
  }

  function reset() {
    imageFile = null;
    imagePreview = '';
    emojiName = '';
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="container">
  <div
    class="drop-area"
    class:drag-over={dragOver}
    on:drop={onDrop}
    on:dragover={onDragOver}
    on:dragleave={onDragLeave}
    on:click={() => fileInput.click()}
  >
    {#if imagePreview}
      <img src={imagePreview} alt="Preview" class="preview" />
      <div class="placeholder">끌어다 놓거나 <span style="color:#4287f5;">파일 선택</span></div>
    {:else}
      <div class="placeholder">
        <svg
          style="width:40px;height:40px;margin-bottom:10px;opacity:0.5;"
          fill="none"
          stroke="#666"
          stroke-width="2"
          viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg
        >
        <!--끌어다 놓거나 <span style="color:#4287f5;">파일 선택</span><br />
        JPEG, PNG, GIF, 또는 WEBP. 대형 파일은 자동으로 크기가 조정되어요.-->
      </div>
    {/if}
    <input
      type="file"
      accept="image/jpeg,image/png,image/gif,image/webp"
      on:change={onFileChange}
      bind:this={fileInput}
      style="display:none"
    />
  </div>

  <div class="right-panel">
    <div class="preview-box">
      <div>미리 보기</div>
      {#if imagePreview}
        <img src={imagePreview} alt="Preview" />
      {:else}
        <div style="opacity:0.3;">없음</div>
      {/if}
    </div>

    <div>
      <label for="emojiName">이모지 이름 *</label>
      <input
        id="emojiName"
        type="text"
        placeholder="emoji_name"
        bind:value={emojiName}
        autocomplete="off"
      />
    </div>

    <button on:click={upload} disabled={uploading}>
      {uploading ? '업로드 중...' : '이모지 업로드하기'}
    </button>
  </div>
</div>

<style>
  .container {
    max-width: 600px;
    margin: auto;
    color: var(--primary-foreground-color);
    background: var(--primary-background-color);
    border-radius: 12px;
    padding: 20px;
    display: flex;
    gap: 20px;
  }
  .drop-area {
    flex: 1;
    border: 2px dashed #666;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    min-height: 300px;
    transition: border-color 0.3s;
  }
  .drop-area.drag-over {
    border-color: var(--primary-activeground-color);
    background: #222;
  }
  .drop-area img.preview {
    max-width: 100%;
    max-height: 260px;
    object-fit: contain;
    border-radius: 8px;
    margin-bottom: 10px;
  }
  .drop-area .placeholder {
    text-align: center;
    font-size: 14px;
    color: #999;
  }
  .right-panel {
    width: 200px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .preview-box {
    background: #1a1a1a;
    border-radius: 8px;
    padding: 10px;
    text-align: center;
  }
  .preview-box img {
    max-width: 60px;
    max-height: 60px;
    margin-bottom: 6px;
  }
  label {
    font-size: 14px;
    margin-bottom: 6px;
    color: #ccc;
  }
  input[type='text'],
  select {
    width: 100%;
    padding: 8px 10px;
    border-radius: 6px;
    border: 1px solid #555;
    background: #222;
    color: #eee;
    font-size: 14px;
  }
  button {
    background: var(--primary-activeground-color);
    color: var(--primary-activeground-font-color);
    border: none;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s;
  }
  button:disabled {
    background: #666;
    cursor: not-allowed;
  }
</style>
