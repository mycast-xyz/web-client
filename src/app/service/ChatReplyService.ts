import { type Readable, writable, type Writable } from 'svelte/store';
import type { ChatMessage } from '../model/chat/ChatMessage';

class ChatReplyServiceInit {
  #stagedChat: Writable<ChatMessage | null> = writable(null);

  get stagedChat(): Readable<ChatMessage | null> {
    return this.#stagedChat;
  }

  stageChat(message: ChatMessage) {
    if (message.type === 'chat') {
      this.#stagedChat.set(message);
    }
  }
}

export const ChatReplyService = new ChatReplyServiceInit();
