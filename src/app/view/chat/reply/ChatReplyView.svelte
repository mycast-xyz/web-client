<script lang="ts">
  import { onMount } from 'svelte';
  import { ChatReplyService } from '../../../service/ChatReplyService';
  import type { ChatMessage } from '../../../model/chat/ChatMessage';

  let message: ChatMessage | null = null;

  onMount(() => {
    ChatReplyService.stagedChat.subscribe((it) => (message = it));
  });
</script>

<div>
  {#if message}
    {message?.body}
    {message?.hash}
  {/if}
</div>
