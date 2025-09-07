import type { CustomEmoji } from './CustomEmoji';

export class VegaEmojiLoader {
  readonly #host = 'https://mycast.xyz:9011/emoji';

  async load(privateKey: string): Promise<CustomEmoji[]> {
    try {
      const url = `${this.#host}/${privateKey}/emojis`;
      const res = await fetch(url);
      const json = await res.json();
      return json as CustomEmoji[];
    } catch {
      return [];
    }
  }
}
