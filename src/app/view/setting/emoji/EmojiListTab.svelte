<script lang="ts">
  import { onMount } from 'svelte';

  import type { CustomEmoji } from '../../../model/emoji/CustomEmoji';
  import { NewEmojiService } from '../../../service/NewEmojiService';
  import { ToastService } from '../../../service/ToastService';

  let emojis: CustomEmoji[] = [];
  let page: number = 1;
  $: currentEmojis = emojis.slice((page - 1) * 10, page * 10);
  $: totalPages = Math.ceil(emojis.length / 10);

  onMount(() => {
    const unsubscribe = NewEmojiService.emojis.subscribe((it) => (emojis = it));
    NewEmojiService.init();

    return () => unsubscribe();
  });

  async function deleteEmoji(idx: number) {
    const ok = await NewEmojiService.delete(idx);
    if (ok) {
      ToastService.toastText('이모지 삭제 완료');
      const newTotalPages = Math.ceil(emojis.length / 10);
      if (page > newTotalPages) {
        page = newTotalPages;
      }
    } else {
      ToastService.toastText('이모지 삭제 실패');
    }
  }
</script>

<div class="content">
  {#if emojis.length > 0}
    <table>
      <thead>
        <tr>
          <th>이미지</th>
          <th>이름</th>
          <th style="width: 48px;" />
        </tr>
      </thead>
      <tbody>
        {#each currentEmojis as emoji}
          <tr>
            <td><img src={emoji.thumbnailUrl} alt={emoji.name} /></td>
            <td>:{emoji.name}:</td>
            <td>
              <button class="delete-btn" title="삭제" on:click={() => deleteEmoji(emoji.idx)}>
                <i class="fas fa-times" />
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <p>없음</p>
  {/if}
</div>
{#if totalPages > 1}
  <div class="pagination">
    <button on:click={() => (page = Math.max(1, page - 1))} disabled={page === 1}>
      <i class="fas fa-chevron-left" />
    </button>
    <span>Page {page} of {totalPages}</span>
    <button on:click={() => (page = Math.min(totalPages, page + 1))} disabled={page === totalPages}>
      <i class="fas fa-chevron-right" />
    </button>
  </div>
{/if}

<style lang="scss">
  .content {
    .emoji-title {
      text-align: center;
      font-size: 1.3em;
      font-weight: bold;
      margin: 0 0 18px 0;
      letter-spacing: 1px;
    }

    max-height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
    font-size: 14px;
    line-height: 1.5;

    button {
      background-color: var(--primary-activeground-color);
      color: var(--primary-activeground-font-color);
      border: none;
      padding: 8px 14px;
      border-radius: 4px;
      cursor: pointer;
      margin: 10px 0;
      font-weight: 600;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      color: var(--primary-foreground-color);
    }

    th,
    td {
      padding: 4px 5px;
      border-bottom: 1px solid #333;
      text-align: center;
      vertical-align: middle;
    }

    img {
      width: 32px;
      height: 32px;
      border-radius: 4px;
      vertical-align: middle;
      margin-right: 8px;
    }

    .delete-btn {
      background: none;
      border: none;
      color: var(--primary-activeground-color);
      font-size: 18px;
      cursor: pointer;
      padding: 0 6px;
      border-radius: 2px;
      transition: background 0.2s;
    }

    .delete-btn:hover {
      background: var(--primary-hoverground-color);
    }

    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }

    &::-webkit-scrollbar-button:start:decrement,
    &::-webkit-scrollbar-button:end:increment {
      display: block;
      height: 5px;
    }

    &::-webkit-scrollbar-track {
      background: var(--primary-background-color);
    }

    &::-webkit-scrollbar-thumb {
      background: var(--primary-activeground-color);
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin: 12px;

    button {
      background: var(--primary-activeground-color);
      color: var(--primary-activeground-font-color);
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.2s;
    }

    button:disabled {
      background: #555;
      cursor: not-allowed;
    }

    button:not(:disabled):hover {
      background: var(--primary-hoverground-color);
    }

    span {
      font-size: 14px;
    }
  }
</style>
