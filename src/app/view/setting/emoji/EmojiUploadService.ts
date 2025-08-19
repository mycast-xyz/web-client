import { EmojiUploadCommand } from '../../../model/chat/emoji/command/EmojiUploadCommand';

class EmojiUploadServiceInit {
  #uploadCommand = new EmojiUploadCommand();

  async uploadByFile(file: File, name: string): Promise<UploadResult> {
    const result = await this.#uploadCommand.execute(file, name);
    return { success: !!result, data: result };
  }
}

type UploadResult = {};

export const EmojiUploadService = new EmojiUploadServiceInit();
