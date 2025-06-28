class ChatReactionServiceInit {
  #stagedChat: string | null = null;

  get stagedChat(): string | null {
    return this.#stagedChat;
  }

  stageChat(hash: string) {
    this.#stagedChat = hash;
  }
}

export const ChatReactionService = new ChatReactionServiceInit();
