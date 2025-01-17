import { writable, type Readable } from 'svelte/store';
import { LocalStorageManager } from '../model/storage/LocalStorageManager';

class OptionServiceInit {
  readonly #timestamp = writable(false);
  readonly #enableBot = writable(true);
  readonly #enableCheckerBar = writable(true);
  readonly #enableCheckerRightAlign = writable(false);
  readonly #enableDataSave = writable(false);
  readonly #enableExprimentSetting = writable(false);
  readonly #chatViewOffset = writable<number>(300);
  readonly #chatViewSide = writable<'left' | 'right'>('left');
  readonly #volume = writable(50);

  #localStorage = new LocalStorageManager();

  constructor() {
    this.#timestamp.set(this.#localStorage.timestamp);
    this.#enableBot.set(this.#localStorage.enableBot);
    this.#enableCheckerBar.set(this.#localStorage.enableCheckerBar);
    this.#enableCheckerRightAlign.set(this.#localStorage.enableCheckerRightAlign);
    this.#enableDataSave.set(this.#localStorage.enableDataSave);
    this.#chatViewOffset.set(this.#localStorage.chatViewOffset);
    this.#chatViewSide.set(this.#localStorage.chatViewSide);
    this.#volume.set(this.#localStorage.volume);
    this.#enableExprimentSetting.set(this.#localStorage.enableExperimentSetting);
  }

  get timestamp(): Readable<boolean> {
    return this.#timestamp;
  }

  get enableBot(): Readable<boolean> {
    return this.#enableBot;
  }

  get enableCheckerBar(): Readable<boolean> {
    return this.#enableCheckerBar;
  }

  get enableCheckerRightAlign(): Readable<boolean> {
    return this.#enableCheckerRightAlign;
  }

  get enableDataSave(): Readable<boolean> {
    return this.#enableDataSave;
  }

  get enableExprimentSetting(): Readable<boolean> {
    return this.#enableExprimentSetting;
  }

  get chatViewOffset(): Readable<number> {
    return this.#chatViewOffset;
  }

  get chatViewSide(): Readable<'left' | 'right'> {
    return this.#chatViewSide;
  }

  get volume(): Readable<number> {
    return this.#volume;
  }

  setTimestamp(value: boolean) {
    this.#timestamp.set(value);
    this.#localStorage.timestamp = value;
  }

  setEnableBot(value: boolean) {
    this.#enableBot.set(value);
    this.#localStorage.enableBot = value;
  }

  setEnableCheckerBar(value: boolean) {
    this.#enableCheckerBar.set(value);
    this.#localStorage.enableCheckerBar = value;
  }

  setEnableCheckerRightAlign(value: boolean) {
    this.#enableCheckerRightAlign.set(value);
    this.#localStorage.enableCheckerRightAlign = value;
  }

  setEnableDataSave(value: boolean) {
    this.#enableDataSave.set(value);
    this.#localStorage.enableDataSave = value;
  }

  setEnableExprimentSetting(value: boolean) {
    this.#enableExprimentSetting.set(value);
    this.#localStorage.enableExperimentSetting = value;
  }

  setChatViewOffset(value: number) {
    this.#chatViewOffset.set(value);
    this.#localStorage.chatViewOffset = value;
  }

  setChatViewSide(value: 'left' | 'right') {
    this.#chatViewSide.set(value);
    this.#localStorage.chatViewSide = value;
  }

  setVolume(value: number) {
    this.#volume.set(value);
    this.#localStorage.volume = value;
  }
}

export const OptionService = new OptionServiceInit();
