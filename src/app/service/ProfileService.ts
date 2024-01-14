import { writable } from 'svelte/store';
import { VegaStreamProfileLoader } from '../model/profile/VegaStreamProfileLoader';

class ProfileServiceInit {
  readonly profileIcon = writable('');
  readonly nickname = writable('');
  readonly statusMessage = writable('');
  readonly platform = writable('local');
  readonly localId = writable('');
  readonly twitchId = writable('');
  readonly afreecaId = writable('');
  readonly youtubeWatchId = writable('');

  async loadStreamProfile(privateKey: string) {
    const profile = await new VegaStreamProfileLoader(privateKey).load();
    this.platform.set(profile.platform);
    this.localId.set(profile.localId);
    this.afreecaId.set(profile.afreecaId);
    this.twitchId.set(profile.twitchId);
    this.youtubeWatchId.set(profile.youtubeHandle);
  }
}

export const ProfileService: ProfileServiceInit = new ProfileServiceInit();
