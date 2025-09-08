<script lang="ts">
  import SettingModal from '../SettingModal.svelte';
  import EmojiListTab from './EmojiListTab.svelte';
  import EmojiUploadTab from './EmojiUploadTab.svelte';

  let tab: 'list' | 'upload' = 'list';
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<SettingModal title="이모지 설정" icon="fas fa-icons">
  <div slot="body" class="site-set-box">
    <div class="tab">
      <div class="item" class:active={tab === 'list'} on:click={() => (tab = 'list')}>List</div>
      <div class="item" class:active={tab === 'upload'} on:click={() => (tab = 'upload')}>
        Upload
      </div>
    </div>

    {#if tab === 'list'}
      <EmojiListTab />
    {:else if tab === 'upload'}
      <EmojiUploadTab />
    {/if}
  </div>
</SettingModal>

<style lang="scss">
  .tab {
    display: flex;
    border-bottom: 2px solid var(--primary-activeground-color);
    margin-bottom: 18px;
    .item {
      user-select: none;
      flex-grow: 1;
      text-align: center;
      padding: 12px 0 10px 0;
      font-size: 1.1em;
      cursor: pointer;
      color: var(--primary-foreground-color);
      background: var(--primary-background-color);
      border-bottom: 2px solid transparent;
      transition: background 0.2s, border-bottom 0.2s, color 0.2s;
    }
    .item.active {
      color: var(--primary-activeground-font-color);
      background: var(--primary-activeground-color);
      border-bottom: 2px solid var(--primary-activeground-color);
      font-weight: bold;
      z-index: 1;
    }
    .item:not(.active):hover {
      background: var(--primary-hoverground-color);
      color: var(--primary-activeground-font-color);
    }
  }
</style>
