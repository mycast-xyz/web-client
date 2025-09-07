import { type Readable, type Writable, writable } from 'svelte/store';
import type { CustomEmoji } from '../model/emoji/CustomEmoji';
import { VegaEmojiHandler } from '../model/emoji/VegaEmojiHandler';
import { SessionService } from './SessionService';

class NewEmojiServiceInit {
  #emojis: Writable<CustomEmoji[]> = writable([]);
  #handler: VegaEmojiHandler = new VegaEmojiHandler();

  get emojis(): Readable<CustomEmoji[]> {
    return this.#emojis;
  }

  async init() {
    const privateKey = SessionService.getPrivateKey();
    this.#emojis.set(await this.#handler.load(privateKey));
  }

  async delete(emojiIdx: number): Promise<boolean> {
    const privateKey = SessionService.getPrivateKey();
    const ok = await this.#handler.delete(privateKey, emojiIdx);
    if (ok) {
      await this.init();
    }
    return ok;
  }
}

export const NewEmojiService = new NewEmojiServiceInit();
