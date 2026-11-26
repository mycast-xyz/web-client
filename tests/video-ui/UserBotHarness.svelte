<script lang="ts">
  import '../../static/global.css';
  import UserBotSettings from '../../src/app/view/userbot/UserBotSettings.svelte';
  import ChatEntry from '../../src/app/view/chat/entry/ChatEntry.svelte';
  import { SessionService } from '../../src/app/service/SessionService';
  SessionService.setPrivateKey('fixture-owner');
  let visible = true;
</script>
<button on:click={() => visible=true}>내 봇 관리 열기</button>
<div class="sample"><ChatEntry prop={{ hash:'sample',nickname:'알림봇',icon:'',senderType:'USER_BOT',senderId:'fixture-bot',owner:{hash:'owner-a',nickname:'테스트 소유자',icon:''},messages:[] }} /></div>
{#if visible}<UserBotSettings close={() => visible=false} />{/if}
<style>
  :global(:root) { --primary-background-color:#282c34; --primary-hoverground-color:#202225; --primary-foreground-color:white; --primary-activeground-color:#ff4081; }
  :global(body) { background:#282c34; color:white; overflow:auto; }
  .sample { width:400px; margin:20px; }
</style>
