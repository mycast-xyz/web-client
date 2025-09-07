import axios from 'axios';
import { SessionService } from '../../../../service/SessionService';

export class EmojiUploadCommand {
  async execute(file: File, name: string): Promise<UploadResult | null> {
    if (!file || !this.#isValidFile(file)) {
      console.error('invalid files');
      return null;
    }

    const base64 = await this.#readData(file);
    const uri = 'https://mycast.xyz:9011/emoji';
    const privKey = SessionService.getPrivateKey();
    try {
      const { data } = await axios.post<UploadResult>(uri, { base64, name, privKey });
      return data;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  #isValidFile(file: File): boolean {
    const validTypes = ['image/png', 'image/jpeg', 'image/gif'];
    return validTypes.includes(file.type);
  }

  #readData(file: File): Promise<string | null> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }
}

export type UploadResult = UploadSuccessResult | UploadFailResult;

type UploadSuccessResult = {
  result: true;
  emoji: UploadEmojiDto;
};

type UploadFailResult = {
  result: false;
  reason: string;
  msg: string;
};

type UploadEmojiDto = {
  type: string;
  name: string;
  imageHash: string;
  thumbnailUrl: string;
  uploaderIdx: number;
};
