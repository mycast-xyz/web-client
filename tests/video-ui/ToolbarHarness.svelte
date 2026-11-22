<script lang="ts">
  import '../../static/global.css';
  import ChatInterface from '../../src/app/view/chat/ChatInterface.svelte';
  import { ChatNetworkService } from '../../src/app/service/ChatNetworkService';
  import type { Writable } from 'svelte/store';
  (ChatNetworkService.isConnected as Writable<boolean>).set(true);
</script>
<div class="review">
  <div class="chat-surface" />
  <div style="height:79px"><ChatInterface /></div>
</div>
<style>
  :global(:root) {
    --primary-background-color:#282c34;
    --primary-hoverground-color:#202225;
    --primary-foreground-color:#fff;
    --primary-activeground-color:#ff4081;
  }
  :global(body) { background:#282c34; }
  .review { width:100%; }
  .chat-surface { height:44px; background:#282c34; }
</style>
