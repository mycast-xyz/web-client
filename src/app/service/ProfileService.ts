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
  readonly youtubeHandle = writable('');
  readonly youtubeVideoId = writable('');

  async loadStreamProfile(privateKey: string) {
    const profile = await new VegaStreamProfileLoader(privateKey).load();
    this.platform.set(profile.platform);
    this.localId.set(profile.localId);
    this.afreecaId.set(profile.afreecaId);
    this.twitchId.set(profile.twitchId);
    this.youtubeHandle.set(profile.youtubeHandle);
    this.youtubeVideoId.set(profile.youtubeVideoId);
  }
}

export const ProfileService: ProfileServiceInit = new ProfileServiceInit();
