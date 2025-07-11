<script lang="ts">
  import { onMount } from 'svelte';
  import { ChatReplyService } from '../../../service/ChatReplyService';

  let hash: string | null = null;

  onMount(() => {
    ChatReplyService.stagedChat.subscribe((it) => (hash = it));
  });
</script>

<div>{hash}</div>
