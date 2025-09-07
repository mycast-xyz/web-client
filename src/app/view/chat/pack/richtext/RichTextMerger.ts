import type { RichText, RichTextEmojiImage } from './RichText';

export class RichTextMerger {
  merge(texts: RichText[]): RichText[] {
    const merged: RichText[] = [];
    let emojiImagesBuffer: RichTextEmojiImage[] = [];

    const flushEmojiImagesBuffer = () => {
      if (emojiImagesBuffer.length === 1) {
        merged.push(emojiImagesBuffer[0]);
      } else if (emojiImagesBuffer.length > 1) {
        merged.push({
          type: 'emoji-images',
          emojis: emojiImagesBuffer.map((e) => ({
            name: e.name,
            url: e.url
          }))
        }); // 타입 정의에 따라 수정 필요
      }
      emojiImagesBuffer = [];
    };

    for (const item of texts) {
      if (item.type === 'emoji-image') {
        emojiImagesBuffer.push(item);
      } else {
        flushEmojiImagesBuffer();
        merged.push(item);
      }
    }
    flushEmojiImagesBuffer();
    return merged;
  }
}
