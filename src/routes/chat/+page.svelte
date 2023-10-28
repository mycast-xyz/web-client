<script lang="ts">
  import { onMount } from 'svelte';
  import { SessionService } from '../../app/service/SessionService';
  import EmbededChatPage from '../../app/view/chat/EmbededChatPage.svelte';

  let userHash: string | null = null;

  onMount(() => {
    SessionService.subscribePrivateKey((v) => (userHash = v));
  });
</script>

{#if userHash}
  <EmbededChatPage privateKey={userHash} />
{/if}
