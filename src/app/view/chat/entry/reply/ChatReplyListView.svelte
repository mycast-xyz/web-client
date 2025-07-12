<script lang="ts">
  import type { ChatReply } from '../../../../model/chat/ChatReply';
  import ChatReplyItemView from './ChatReplyItemView.svelte';

  export let replies: ChatReply[] = [];
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<div class="main">
  {#each replies as reply}
    <ChatReplyItemView {reply} />
  {/each}
</div>
