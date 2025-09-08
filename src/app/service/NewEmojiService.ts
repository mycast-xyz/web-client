import { type Readable, type Writable, writable } from 'svelte/store';
import type { CustomEmoji, CustomEmojiDetail } from '../model/emoji/CustomEmoji';
import { VegaEmojiHandler } from '../model/emoji/VegaEmojiHandler';
import { SessionService } from './SessionService';

class NewEmojiServiceInit {
  #allEmojis: Writable<CustomEmojiDetail[]> = writable([]);
  #emojis: Writable<CustomEmoji[]> = writable([]);
  #handler: VegaEmojiHandler = new VegaEmojiHandler();

  get emojis(): Readable<CustomEmoji[]> {
    return this.#emojis;
  }

  get allEmojis(): Readable<CustomEmojiDetail[]> {
    return this.#allEmojis;
  }

  async init() {
    const privateKey = SessionService.getPrivateKey();
    this.#emojis.set(await this.#handler.load(privateKey));
  }

  async fetchAll() {
    const details = await this.#handler.loadAll();
    this.#allEmojis.set(details);
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
