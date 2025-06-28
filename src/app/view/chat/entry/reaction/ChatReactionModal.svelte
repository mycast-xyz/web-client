<script lang="ts">
  import { onMount } from 'svelte';
  import { WindowService } from '../../../../service/WindowService';
  import ModalTextInput from '../../../../view-framework/modal/input/ModalTextInput.svelte';
  import Modal from '../../../../view-framework/modal/Modal.svelte';
  import { SocketService } from '../../../../service/SocketService';
  import { SessionService } from '../../../../service/SessionService';
  import { ChatReactionService } from '../../../../service/ChatReactionService';
  import { EmojiUtils } from '../../../../model/chat/emoji/EmojiUtils';

  let reaction: string;

  function onKeyDown(code: string) {
    if (code === 'Enter') {
      if (EmojiUtils.isEmoji(reaction)) {
        const privateKey = SessionService.getPrivateKey();
        const stagedChat = ChatReactionService.stagedChat;
        stagedChat && SocketService.reaction?.execute(privateKey, stagedChat, `c${reaction}`);
      }
      WindowService.closeModal();
    } else {
      reaction = '';
    }
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
  </div></Modal
>
