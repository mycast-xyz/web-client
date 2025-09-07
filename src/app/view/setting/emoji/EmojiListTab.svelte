<script lang="ts">
  import { onMount } from 'svelte';

  import type { CustomEmoji } from '../../../model/emoji/CustomEmoji';
  import { NewEmojiService } from '../../../service/NewEmojiService';
  import { ToastService } from '../../../service/ToastService';

  let emojis: CustomEmoji[] = [];

  onMount(() => {
    NewEmojiService.emojis.subscribe((it) => (emojis = it));
    NewEmojiService.init();
  });

  async function deleteEmoji(idx: number) {
    const ok = await NewEmojiService.delete(idx);
    if (ok) {
      ToastService.toastText('이모지 삭제 완료');
    } else {
      ToastService.toastText('이모지 삭제 실패');
    }
  }
</script>

<div class="content">
  <h3>내 이모지</h3>

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
        {#each emojis as emoji}
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

<style lang="scss">
  .content {
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
      padding: 8px 5px;
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
  }
</style>
