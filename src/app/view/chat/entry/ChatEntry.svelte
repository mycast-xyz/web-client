<script lang="ts">
  import type { ChatMessage } from '../../../model/chat/ChatMessage';
  import type { ChatGroup } from './ChatGroup';
  import ChatMessageEntry from './ChatMessageEntry.svelte';
  import ChatEntryIcon from './icon/ChatEntryIcon.svelte';

  export let prop: ChatGroup = {
    hash: '',
    icon: '',
    nickname: 'untitled',
    senderType: 'PC',
    messages: []
  };
  export let messages: ChatMessage[] = [];
</script>

<div class="chat-entry">
  <div class="icon-section">
    <div class="icon">
      {#if prop.senderType === 'USER_BOT' && !prop.icon}
        <div class="user-bot-avatar" aria-label="기본 프로필"><i class="fas fa-user-circle" /></div>
      {:else}
        <ChatEntryIcon src={prop.icon} />
      {/if}
    </div>
  </div>
  <div class="message-section">
    <div class="header">
      <div class="nickname">
        <span>{prop.nickname}</span>
        <span class="type">
          {#if prop.senderType === 'MOBILE'}
            <i class="fas fa-mobile" />
          {:else if prop.senderType === 'BOT' || prop.senderType === 'USER_BOT'}
            <i class="fas fa-bug" />
          {/if}
        </span>
        {#if prop.senderType === 'USER_BOT' && prop.owner}
          <span class="owner" title={'소유자: ' + prop.owner.nickname}>소유자: {prop.owner.nickname}</span>
        {/if}
      </div>
    </div>
    {#each messages as message}
      <div class="chat-message-entry">
        <ChatMessageEntry {message} />
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .user-bot-avatar { width:50px; height:50px; display:flex; align-items:center; justify-content:center; opacity:.65; }
  .user-bot-avatar i { font-size:36px; }
  .owner { margin-left: 6px; font-size: 12px; font-weight: normal; opacity: .75; }
  .chat-entry {
    position: relative;
    display: flex;
    width: 100%;
    height: auto;
    border-bottom: 1px solid var(--primary-hoverground-color);
    padding-bottom: 2px;
    &:last-child {
      padding-bottom: 0px;
      border-bottom: 0px;
    }
  }

  .icon-section {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    padding: 5px 0px;
  }

  .message-section {
    display: block;
    width: calc(100% - 60px);
    min-height: 50px;
    padding: 5px;
    padding-top: 8px;

    .header {
      width: 100%;
      max-height: 40px;
      padding-bottom: 5px;
      display: flex;

      // 공통 구문
      & > div {
        flex: 0;
      }

      .nickname {
        width: calc(100% - 100px);
        font-size: 14px;
        line-height: 20px;
        font-weight: 300;
        color: var(--primary-foreground-color);
        padding-top: 0px;
        flex: 1;

        span {
          padding-top: 2px;
          color: var(--primary-foreground-color);
        }

        span.type {
          margin-left: 2px;

          i {
            font-size: 10px;
          }
        }
      }
    }
  }
</style>
