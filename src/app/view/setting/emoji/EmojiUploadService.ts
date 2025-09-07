import {
  EmojiUploadCommand,
  type UploadResult
} from '../../../model/chat/emoji/command/EmojiUploadCommand';

class EmojiUploadServiceInit {
  #uploadCommand = new EmojiUploadCommand();

  async uploadByFile(file: File, name: string): Promise<UploadResult> {
    const result = await this.#uploadCommand.execute(file, name);
    return result ?? { result: false, reason: 'unknown', msg: '네트워크 오류가 발생했습니다.' };
  }
}

export const EmojiUploadService = new EmojiUploadServiceInit();
