import { get, type Readable, writable, type Writable } from 'svelte/store';
import type { ChatMessage } from '../model/chat/ChatMessage';

class ChatReplyServiceInit {
  #stagedChat: Writable<ChatMessage | null> = writable(null);

  get stagedChat(): Readable<ChatMessage | null> {
    return this.#stagedChat;
  }

  isStaged(): boolean {
    return get(this.#stagedChat) ? true : false;
  }

  stageChat(message: ChatMessage) {
    if (message.type === 'chat' || message.type === 'image') {
      this.#stagedChat.set(message);
    }
  }

  unstageChat() {
    this.#stagedChat.set(null);
  }
}

export const ChatReplyService = new ChatReplyServiceInit();
