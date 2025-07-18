import { writable, type Readable, type Writable } from 'svelte/store';
import type { ScrollDownEvent } from './chat/ScrollDownEvent';

class ChatServiceInit {
  readonly #scrollLock: Writable<boolean> = writable(false);
  readonly #scrollDownEvent: Writable<ScrollDownEvent | null> = writable(null);
  readonly #activeChatMessage: Writable<string | null> = writable(null);
  #focusInputEvent: Writable<boolean> = writable(false);

  get scrollLock(): Readable<boolean> {
    return this.#scrollLock;
  }

  get activeChatMessage(): Readable<string | null> {
    return this.#activeChatMessage;
  }

  get scrollDownEvent(): Readable<ScrollDownEvent | null> {
    return this.#scrollDownEvent;
  }

  get focusInputEvent(): Readable<boolean> {
    return this.#focusInputEvent;
  }

  requestScrollDown(force: boolean = false) {
    this.#scrollDownEvent.set({ force });
  }

  setActive(chatMessageHash: string | null) {
    this.#activeChatMessage.set(chatMessageHash);
  }

  setScrollLock(value: boolean) {
    this.#scrollLock.set(value);
  }

  focusInput() {
    this.#focusInputEvent.set(true);
    this.#focusInputEvent.set(false);
  }
}

export const ChatService = new ChatServiceInit();
