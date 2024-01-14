import axios from 'axios';

export class ModifyStreamCommand {
  async execute(
    privateKey: string,
    platform: string,
    backgroundImage: string,
    afreecaId: string,
    twitchId: string,
    youtubeWatchId: string
  ): Promise<boolean> {
    const url = `https://mycast.xyz:9011/user/${privateKey}/stream`;
    try {
      const form = {
        platform,
        backgroundImage,
        afreecaId,
        twitchId,
        youtubeWatchId
      };
      const { data } = await axios.put<PutStreamDto>(url, form);
      return data.result;
    } catch {
      return false;
    }
  }
}

type PutStreamDto = {
  result: boolean;
};
