<script lang="ts">
  import { onMount } from 'svelte';
  import type { ChatMessage } from '../../../model/chat/ChatMessage';
  import { ChatReplyService } from '../../../service/ChatReplyService';

  let message: ChatMessage | null = null;

  $: onMount(() => {
    ChatReplyService.stagedChat.subscribe((it) => (message = it));
  });
</script>

{#if message}
  <div class="main">
    <i class="fas fa-comment-dots" />
    {#if message.type === 'chat'}
      <div class="body">
        {message.body}
      </div>
    {/if}
    {#if message.type === 'image'}
      <div class="body">
        <!-- svelte-ignore a11y-missing-attribute -->
        <img src={message.body} />
      </div>
    {/if}
    <button on:click={() => ChatReplyService.unstageChat()}>
      <i class="fas fa-backspace" />
    </button>
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
    flex-grow: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;

    img {
      width: auto;
      height: 30px;
    }
  }

  .main i {
    font-size: 0.85rem;
    opacity: 0.7;
    margin-right: 5px;
    flex-shrink: 0;
    position: relative;
    top: 1px;
  }

  .main button {
    background: none;
    flex-shrink: 0;
    width: 30px;
    margin: 0;
    padding: 0;
    outline: none;
    border: none;
    color: var(--primary-foreground-color);

    &:hover {
      color: var(--primary-activeground-color);
    }
  }
</style>
