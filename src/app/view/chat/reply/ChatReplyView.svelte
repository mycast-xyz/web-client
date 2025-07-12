<script lang="ts">
  import { onMount } from 'svelte';
  import { ChatReplyService } from '../../../service/ChatReplyService';
  import type { ChatMessage } from '../../../model/chat/ChatMessage';

  let message: ChatMessage | null = null;

  $: onMount(() => {
    ChatReplyService.stagedChat.subscribe((it) => (message = it));
  });
</script>

{#if message}
  <div class="main">
    <i class="fas fa-comment-dots" />
    <div class="body">
      {message.body}
      {message?.hash}
    </div>
  </div>
{/if}

<style lang="scss">
  .main {
    background: var(--primary-background-color);
    color: var(--primary-foreground-color);
    font-size: 0.9rem;
    padding: 6px 12px;
    border-left: 4px solid var(--primary-activeground-color);
    display: flex;
    align-items: center;
    max-width: 100%;

    opacity: 0.9;
  }

  .body {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
  }

  .main i {
    font-size: 0.85rem; /* 텍스트 크기보다 약간 작게 */
    opacity: 0.7;
    margin-right: 5px;
    flex-shrink: 0;
    position: relative;
    top: 1px; /* 텍스트와 baseline 맞추기 위해 미세 조정 */
  }
</style>
