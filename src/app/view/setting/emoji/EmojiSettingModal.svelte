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
      <div class="item" on:click={() => (tab = 'list')}>List</div>
      <div class="item" on:click={() => (tab = 'upload')}>Upload</div>
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
    .item {
      user-select: none;
      flex-grow: 1;
      text-align: center;

      &:hover {
        background-color: var(--primary-activeground-color);
      }
    }
  }
</style>
