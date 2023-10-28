import { writable, type Readable, type Writable } from 'svelte/store';
import type { PopupContent } from './PopupContent';

class PopupContentServiceInit {
  #contents: Writable<PopupContent[]> = writable([]);

  get contents(): Readable<PopupContent[]> {
    return this.#contents;
  }

  addContent(content: PopupContent) {
    this.#contents.update((it) => [...it, content]);
  }

  removeContent(content: PopupContent) {
    this.#contents.update((it) => it.filter((c) => c !== content));
  }
}
export const PopupContentService = new PopupContentServiceInit();
