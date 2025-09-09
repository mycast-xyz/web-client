<script lang="ts">
  import { onMount } from 'svelte';
  import type { CustomEmojiDetail } from '../../../model/emoji/CustomEmoji';
  import { EmojiService } from '../../../service/EmojiService';
  import { NewEmojiService } from '../../../service/NewEmojiService';
  import { SessionService } from '../../../service/SessionService';
  import { SocketService } from '../../../service/SocketService';
  import { WindowService } from '../../../service/WindowService';
  import { ChatReactionService } from '../../../service/ChatReactionService';

  let recentEmojies: string[] = [];
  let customEmojis: CustomEmojiDetail[] = [];
  let tab: 'default' | 'custom' = 'default';

  const emojiStream: string =
    '😒 😊 😂 🤣 ❤ 😍 👌 😘 🤷‍♂️ 🤷‍♀️ 🤦‍♂️ 🤦‍♀️ 🙌 👍 😁 💕 ✌ 🤞 😉 😎 🎶 😢 💖 😜 🤳 🎂 🎉 🌹 💋 👏 ✔ 👀 😃 ✨ 😆 🤔 🤢 🎁';
  const emojies: string[] = emojiStream.split(' ');

  onMount(() => {
    const unsubscribeRecents = EmojiService.recents.subscribe((it) => (recentEmojies = it));
    const unsubscribeCustom = NewEmojiService.allEmojis.subscribe((it) => (customEmojis = it));
    NewEmojiService.init();
    NewEmojiService.fetchAll();

    return () => {
      unsubscribeRecents();
      unsubscribeCustom();
    };
  });

  function onEmojiClick(emoji: string) {
    sendEmoji('emoji', `c${emoji}`);
    EmojiService.registerRecent(emoji);
    WindowService.closeEmojiReactionView();
  }

  function onCustomEmojiClick(emoji: CustomEmojiDetail) {
    sendEmoji('emoji-image', emoji.name);
    WindowService.closeEmojiReactionView();
  }

  function sendEmoji(type: 'emoji' | 'emoji-image', value: string) {
    const privateKey = SessionService.getPrivateKey();
    const staged = ChatReactionService.stagedChat;
    if (!staged) {
      console.warn('No staged chat for emoji reaction');
      return;
    }
    SocketService.reaction?.execute(privateKey, staged, type, value);
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="container">
  <div class="title">
    <h4>반응 추가</h4>
    <button class="close-button" on:click={() => WindowService.closeEmojiReactionView()}>
      <i class="fas fa-times" />
    </button>
  </div>
  <div class="tab-container">
    <div class="item" class:active={tab === 'default'} on:click={() => (tab = 'default')}>기본</div>
    <div class="item" class:active={tab === 'custom'} on:click={() => (tab = 'custom')}>커스텀</div>
  </div>
  <div class="emoji-list">
    {#if tab === 'default'}
      {#if recentEmojies.length > 0}
        <div class="recent-title">
          <h5>최근 사용</h5>
        </div>
        <div class="def-emoji-list">
          {#each recentEmojies as emoji}
            <span on:click={(_) => onEmojiClick(emoji)}>{emoji}</span>
          {/each}
        </div>
        <hr />
      {/if}
      <div class="def-emoji-list">
        {#each emojies as emoji}
          <span on:click={(_) => onEmojiClick(emoji)}>{emoji}</span>
        {/each}
      </div>
    {:else if tab === 'custom'}
      <div class="custom-emoji-list">
        {#if customEmojis.length > 0}
          {#each customEmojis as emoji (emoji.name)}
            <button class="custom-emoji-item" on:click={() => onCustomEmojiClick(emoji)}>
              <img src={emoji.thumbnailUrl} alt={emoji.name} title={`:${emoji.name}:`} />
            </button>
          {/each}
        {:else}
          <p class="no-custom-emoji">등록된 커스텀 이모지가 없습니다.</p>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  $title-container-height: 35px;
  $tab-container-height: 38px;

  .container {
    position: relative;
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    overflow: hidden;
    border-radius: 5px;
    margin: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);

    .title {
      display: flex;
      width: calc(100% - 8px);
      height: $title-container-height;
      padding: 0 0 0 8px;
      align-items: center;
      justify-content: space-between;

      h4 {
        margin: 0;
        font-size: 1em;
        font-weight: bold;
      }

      .close-button {
        background: none;
        border: none;
        color: var(--primary-foreground-color);
        cursor: pointer;
        font-size: 1.1em;
        line-height: 1;
        margin: 0;
        border-radius: 2px;

        &:hover {
          background-color: var(--primary-activeground-color);
        }
      }
    }

    .tab-container {
      display: flex;
      border-bottom: 2px solid var(--primary-activeground-color);
      .item {
        user-select: none;
        flex-grow: 1;
        text-align: center;
        padding: 8px 0 6px 0;
        font-size: 0.9em;
        cursor: pointer;
        color: var(--primary-foreground-color);
        background: var(--primary-background-color);
        border-bottom: 2px solid transparent;
        transition: background 0.2s, border-bottom 0.2s, color 0.2s;
      }
      .item.active {
        color: var(--primary-activeground-font-color);
        background: var(--primary-activeground-color);
        border-bottom: 2px solid var(--primary-activeground-color);
        font-weight: bold;
        z-index: 1;
      }
      .item:not(.active):hover {
        background: var(--primary-hoverground-color);
        color: var(--primary-activeground-font-color);
      }
    }
    .emoji-list {
      width: 100%;
      height: calc(100% - #{$title-container-height} - #{$tab-container-height});
      overflow-y: scroll;
      scrollbar-width: thin;

      &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
        border: 3px solid;
      }

      &::-webkit-scrollbar-button:start:decrement,
      &::-webkit-scrollbar-button:end:increment {
        display: block;
        height: 5px;
      }

      &::-webkit-scrollbar-track {
        background: var(--primary-background-color);
      }

      &::-webkit-scrollbar-thumb {
        background: var(--primary-activeground-color);
      }
      .recent-title {
        width: calc(100% - 10px);
        height: 20px;
        padding: 5px;
        border-bottom: 1px solid;
        h5 {
          padding-top: 2px;
          font-size: 12px;
        }
      }
      .def-emoji-list {
        width: 100%;
        height: auto;
        padding: 10px 0px;
        // flex 설정
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-content: space-around;
        align-items: center;
        span {
          width: 30px;
          height: 30px;
          padding: 10px;
          font-size: 24px;
          display: inline-block;
          text-align: center;
          border-radius: 3px;
          overflow: hidden;
          cursor: pointer;
        }
      }
      .custom-emoji-list {
        display: flex;
        flex-wrap: wrap;
        padding: 10px;
        gap: 8px;
        .custom-emoji-item {
          background: none;
          border: none;
          padding: 5px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
          &:hover {
            background-color: var(--primary-hoverground-color);
          }
          img {
            width: 32px;
            height: 32px;
            object-fit: contain;
          }
        }
        .no-custom-emoji {
          width: 100%;
          text-align: center;
          color: #888;
          font-size: 14px;
          margin-top: 20px;
        }
      }
    }
  }

  // 컬러 스크롤링 컬러셋
  .container {
    background: var(--primary-background-color);
    color: var(--primary-foreground-color);

    .title {
      background-color: var(--primary-hoverground-color);
    }
    .emoji-list {
      scrollbar-color: var(--primary-activeground-color) var(--primary-background-color);
      scrollbar-width: thin;
      &::-webkit-scrollbar {
        border-color: var(--primary-background-color);
      }
      &::-webkit-scrollbar-button:start:decrement,
      &::-webkit-scrollbar-button:end:increment {
        background: var(--primary-background-color);
      }
      &::-webkit-scrollbar-track {
        background: var(--primary-background-color);
      }
      &::-webkit-scrollbar-thumb {
        background: var(--primary-activeground-color);
      }
      .recent-title {
        border-bottom-color: var(--primary-hoverground-color);
      }
      hr {
        border-color: var(--primary-hoverground-color);
      }
      .def-emoji-list {
        background-color: var(--primary-background-color);
        span {
          &:hover {
            background: var(--primary-activeground-color);
          }
          &:active {
            background: var(--primary-activeground-color);
          }
        }
      }
    }
  }
</style>
