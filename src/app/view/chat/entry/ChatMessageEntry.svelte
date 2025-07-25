<script lang="ts">
  import { SvelteComponent, onMount, type ComponentType } from 'svelte';
  import { get } from 'svelte/store';
  import type { ChatMessage } from '../../../model/chat/ChatMessage';
  import { ChatReactionService } from '../../../service/ChatReactionService';
  import { ChatReplyService } from '../../../service/ChatReplyService';
  import { ChatService } from '../../../service/ChatService';
  import { OptionService } from '../../../service/OptionService';
  import { SessionService } from '../../../service/SessionService';
  import { SocketService } from '../../../service/SocketService';
  import { WindowService } from '../../../service/WindowService';
  import { MobileUtils } from '../../../util/mobile/MobileUtils';
  import AfreecaPack from '../pack/AfreecaPack.svelte';
  import AnimationPack from '../pack/AnimationPack.svelte';
  import AzurlaneShipPack from '../pack/AzurlaneShipPack.svelte';
  import LinkPack from '../pack/LinkPack.svelte';
  import LolChampionPack from '../pack/LolChampionPack.svelte';
  import LolUserPack from '../pack/LolUserPack.svelte';
  import MemoPack from '../pack/MemoPack.svelte';
  import MoviePack from '../pack/MoviePack.svelte';
  import StreamPack from '../pack/StreamPack.svelte';
  import TextPack from '../pack/TextPack.svelte';
  import TwitchChannelPack from '../pack/TwitchChannelPack.svelte';
  import TwitchClipPack from '../pack/TwitchClipPack.svelte';
  import YoutubePack from '../pack/YoutubePack.svelte';
  import BookPack from '../pack/book/BookPack.svelte';
  import GeneralPurposeCardPack from '../pack/gpc/GeneralPurposeCardPack.svelte';
  import GeneralPurposeCarouselPack from '../pack/gpc/GeneralPurposeCarouselPack.svelte';
  import ImagePack from '../pack/image/ImagePack.svelte';
  import MobileImagePack from '../pack/image/MobileImagePack.svelte';
  import TwitchVideoPack from '../pack/video/TwitchVideoPack.svelte';
  import ReactionList from './reaction/ChatReactionListView.svelte';
  import ReplyList from './reply/ChatReplyListView.svelte';

  export let message: ChatMessage;
  let menuActive: boolean = false;
  let enableTimestamp: boolean = false;
  let enableExprimentSetting: boolean = false;

  const packs: Pack[] = [
    { type: 'afreeca', component: AfreecaPack },
    { type: 'animation', component: AnimationPack },
    { type: 'book', component: BookPack },
    { type: 'chat', component: TextPack },
    {
      type: 'image',
      component: ImagePack,
      mobileComponent: MobileImagePack
    },
    { type: 'link', component: LinkPack },
    { type: 'memo', component: MemoPack },
    { type: 'movie', component: MoviePack },
    { type: 'general-purpose-card', component: GeneralPurposeCardPack },
    { type: 'al-ship', component: AzurlaneShipPack },
    { type: 'general-purpose-carousel', component: GeneralPurposeCarouselPack },
    { type: 'youtube', component: YoutubePack },
    { type: 'stream', component: StreamPack },
    { type: 'twitch', component: TwitchChannelPack },
    { type: 'twitch-clip', component: TwitchClipPack },
    { type: 'twitch-video', component: TwitchVideoPack },
    { type: 'lol', component: LolUserPack },
    { type: 'champion', component: LolChampionPack }
  ];

  const defaultReactionMenus = [
    { icon: '👍', value: 'thumb-up' },
    { icon: '👎', value: 'thumb-down' },
    { icon: '👏', value: 'clap' },
    { icon: '😆', value: 'laugh' },
    { icon: '😢', value: 'sad' },
    { icon: '🤢', value: 'disgust' }
  ];
  let customReactionMenus: string[] = [];

  $: pack = getComponent(message.type);
  $: reactions = message.reactions;
  $: replies = message.replies;
  $: timestamp = convertTimeToString(new Date(message.timestamp).getTime());
  $: reactionMenus = defaultReactionMenus.concat(
    customReactionMenus.map((e) => ({ icon: e, value: `c${e}` }))
  );

  const getComponent = (type: string): typeof SvelteComponent | null => {
    const pack = packs.find((p) => p.type === type);
    if (!pack) {
      return null;
    }
    if (MobileUtils.isMobile() && pack.mobileComponent) {
      return pack.mobileComponent ? pack.mobileComponent : pack.component;
    } else {
      return pack.component;
    }
  };

  const convertTimeToString = (timestamp: number): string => {
    const padZero = (n: number) => (n < 10 ? `0${n}` : n);
    const time = new Date(timestamp);

    const y = time.getFullYear();
    const mm = padZero(time.getMonth() + 1);
    const d = padZero(time.getDate());
    const h = padZero(time.getHours());
    const m = padZero(time.getMinutes());
    const s = padZero(time.getSeconds());
    return `${y}-${mm}-${d} ${h}:${m}:${s}`;
  };

  onMount(() => {
    ChatService.activeChatMessage.subscribe((it) => (menuActive = it === message.hash));
    OptionService.timestamp.subscribe((it) => (enableTimestamp = it));
    OptionService.enableExprimentSetting.subscribe((it) => (enableExprimentSetting = it));
  });

  function onReactionClick(reactionValue: string) {
    const privateKey = SessionService.getPrivateKey();
    const chatHash = message.hash;
    SocketService.reaction?.execute(privateKey, chatHash, reactionValue);
  }

  function onCustomReactionClick() {
    ChatReactionService.stageChat(message.hash);
    WindowService.openModal('chat-reaction');
  }

  function onMouseEnter() {
    if (!MobileUtils.isMobile()) {
      ChatService.setActive(message.hash);
    }
  }

  function onMouseLeave() {
    if (!MobileUtils.isMobile()) {
      ChatService.setActive(null);
    }
  }

  function onClick() {
    if (MobileUtils.isMobile()) {
      if (message.hash === get(ChatService.activeChatMessage)) {
        ChatService.setActive(null);
      } else {
        ChatService.setActive(message.hash);
      }
    }
  }

  function onReplyClick() {
    ChatReplyService.stageChat(message);
    ChatService.focusInput();
  }

  type Pack = {
    type: string;
    component: ComponentType;
    mobileComponent?: ComponentType;
  };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  class="container"
  class:hover={menuActive}
  on:mouseenter={onMouseEnter}
  on:mouseleave={onMouseLeave}
  on:click={onClick}
  on:dblclick|preventDefault={(_) => onReplyClick()}
>
  <div class="body">
    {#if pack}
      <svelte:component this={pack} body={message.body} />
    {:else}
      {message.type}
    {/if}

    <div class="menu">
      {#if message.type === 'chat'}
        <button on:click={(_) => onReplyClick()}>
          <i class="fas fa-comment-dots" />
        </button>
      {/if}
      {#each reactionMenus as menu}
        <button on:click={(_) => onReactionClick(menu.value)}>
          <span>{menu.icon}</span>
        </button>
      {/each}
      {#if enableExprimentSetting}
        <button on:click={(_) => onCustomReactionClick()}><i class="fas fa-icons" /></button>
      {/if}
    </div>
  </div>
  {#if reactions?.length > 0}
    <div class="reaction">
      <ReactionList {reactions} />
    </div>
  {/if}
  {#if replies?.length > 0}
    <div>
      <ReplyList {replies} />
    </div>
  {/if}
  {#if enableTimestamp}
    <div class="footer">{timestamp}</div>
  {/if}
</div>

<style lang="scss">
  .container {
    .body {
      position: relative;
      width: 100%;
      word-wrap: break-word;
      color: var(--primary-foreground-color);
      padding-bottom: 4px;
      .menu {
        display: flex;
        position: absolute;
        right: -1px;
        bottom: -0px;
        width: auto;
        padding: 5px;
        background-color: var(--primary-hoverground-color);
        border-radius: 3px;
        justify-content: flex-end;
        visibility: collapse;

        z-index: 2;

        button {
          width: 20px;
          height: 20px;
          padding: 0;
          margin: 0;
          border: none;
          border-radius: 10px;
          outline: none;
          margin-left: 5px;

          background: var(--primary-hoverground-color);
          color: var(--primary-foreground-color);

          &:hover {
            color: var(--primary-activeground-color);
          }

          &:first-child {
            margin-left: 0px;
          }
        }
      }
    }
    .footer {
      display: block;
      font-size: 8px;
      line-height: 10px;
      text-align: end;
      padding-bottom: 6px;
      color: #6c6f75;
    }

    &.hover {
      .menu {
        visibility: visible;
      }
    }
  }
</style>
