import { writable, type Readable, type Writable } from 'svelte/store';
import type { Photo } from '../model/photo/Photo';

class PhotoContentManager {
  #currentPhoto: Writable<Photo | null> = writable(null);

  get currentPhoto(): Readable<Photo | null> {
    return this.#currentPhoto;
  }

  setCurrentPhoto(photo: Photo | null) {
    this.#currentPhoto.set(photo);
  }
}

export const PhotoContentService = new PhotoContentManager();
