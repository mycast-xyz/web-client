import { type Readable, writable, type Writable } from 'svelte/store';

class ChatReplyServiceInit {
  #stagedChat: Writable<string | null> = writable(null);

  get stagedChat(): Readable<string | null> {
    return this.#stagedChat;
  }

  stageChat(hash: string) {
    this.#stagedChat.set(hash);
  }
}

export const ChatReplyService = new ChatReplyServiceInit();
