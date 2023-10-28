import { get, writable, type Readable, type Writable } from 'svelte/store';
import { LocalStorageManager } from '../model/storage/LocalStorageManager';
import { ColorSet } from '../model/theme/ColorSet';
import { browser } from '$app/environment';

class ThemeServiceInit {
  #theme: Writable<Theme> = writable('default');
  #storage = new LocalStorageManager();

  get theme(): Readable<Theme> {
    return this.#theme;
  }

  init() {
    this.#theme.set(this.#storage.isDarkMode ? 'dark' : 'default');
    this.#refresh();
  }

  setTheme(theme: Theme) {
    this.#theme.set(theme);
    this.#storage.isDarkMode = theme === 'dark';

    this.#refresh();
  }

  #refresh() {
    const colorEntries = Object.entries(this.#getColorEntries());
    const css = colorEntries
      .map(([key, value]) => {
        const newKey = key.replace(/[A-Z]/g, (value) => `-${value.toLowerCase()}`);
        return `--${newKey}:${value}`;
      })
      .join(';');
    if (browser) {
      document.documentElement.style.cssText = css;
    }
  }

  #getColorEntries() {
    switch (get(this.#theme)) {
      case 'dark':
        return ColorSet.DarkTheme;
      case 'default':
      default:
        return ColorSet.DefaultTheme;
    }
  }
}

export const ThemeService = new ThemeServiceInit();
