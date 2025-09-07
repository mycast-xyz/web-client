import { type Readable, type Writable, writable } from 'svelte/store';
import type { CustomEmoji } from '../model/emoji/CustomEmoji';
import { VegaEmojiLoader } from '../model/emoji/VegaEmojiLoader';
import { SessionService } from './SessionService';

class NewEmojiServiceInit {
  #emojis: Writable<CustomEmoji[]> = writable([]);
  #loader: VegaEmojiLoader = new VegaEmojiLoader();

  get emojis(): Readable<CustomEmoji[]> {
    return this.#emojis;
  }

  async init() {
    const privateKey = SessionService.getPrivateKey();
    this.#emojis.set(await this.#loader.load(privateKey));
  }
}

export const NewEmojiService = new NewEmojiServiceInit();
