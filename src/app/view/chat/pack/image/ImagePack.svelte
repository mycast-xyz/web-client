<script lang="ts">
  import { get } from 'svelte/store';
  import { ChatService } from '../../../../service/ChatService';
  import { OptionService } from '../../../../service/OptionService';
  import { WindowService } from '../../../../service/WindowService';

  export let body = '';

  let show = !get(OptionService.enableDataSave);

  const openImageViewerPopup = () => {
    WindowService.openImageViewerPopup(body);
  };

  OptionService.enableDataSave.subscribe((it) => (show = !it));

  function onImageLoaded() {
    ChatService.requestScrollDown();
  }
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="container">
  {#if show}
    <img
      class="image"
      src={body}
      alt="이미지"
      on:click={openImageViewerPopup}
      on:load={onImageLoaded}
    />
  {:else}
    <div class="saved" on:click={(_) => (show = true)}><strong>이미지</strong></div>
  {/if}
</div>

<style lang="scss">
  .container {
    width: 100%;
    height: auto;
    text-align: center;

    div.saved {
      width: 100%;
      text-align: start;
    }
  }

  .image {
    max-width: 90%;
    height: auto;
    max-height: 300px;
    background: var(--primary-hoverground-color);
    border: 1px solid var(--primary-hoverground-color);
    border-radius: 2px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  }
</style>
