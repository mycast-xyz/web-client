<script lang="ts">
  import { EmojiUtils } from '../../../../model/chat/emoji/EmojiUtils';
  import { ChatReactionService } from '../../../../service/ChatReactionService';
  import { SessionService } from '../../../../service/SessionService';
  import { SocketService } from '../../../../service/SocketService';
  import { ToastService } from '../../../../service/ToastService';
  import { WindowService } from '../../../../service/WindowService';
  import ModalTextInput from '../../../../view-framework/modal/input/ModalTextInput.svelte';
  import Modal from '../../../../view-framework/modal/Modal.svelte';

  let reaction: string;

  function onKeyDown(code: string) {
    if (code === 'Enter') {
      submitReaction();
    } else {
      reaction = '';
    }
  }

  function submitReaction() {
    if (EmojiUtils.isEmoji(reaction)) {
      const privateKey = SessionService.getPrivateKey();
      const stagedChat = ChatReactionService.stagedChat;
      stagedChat && SocketService.reaction?.execute(privateKey, stagedChat, `c${reaction}`);
    } else {
      ToastService.toastText('추가 실패');
    }
    WindowService.closeModal();
  }
</script>

<Modal title="반응 추가" icon="fas fa-icons" on:oncloseclick={() => WindowService.closeModal()}>
  <div slot="body">
    <ModalTextInput
      title="추가할 반응"
      bind:value={reaction}
      name=""
      on:keydown={(e) => onKeyDown(e.detail)}
    />
  </div>
  <div slot="footer">
    <button class="footer-button" on:click={() => submitReaction()}>SUBMIT</button>
  </div>
</Modal>

<style lang="scss">
  .footer-button {
    width: 100%;
    height: auto;
    border: 0px;
    background-color: var(--primary-activeground-color);
    color: var(--primary-activeground-font-color);

    &:disabled {
      background-color: var(--primary-hoverground-color);
    }
  }
</style>
