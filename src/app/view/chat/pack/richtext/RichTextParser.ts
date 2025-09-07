import type { RichText } from './RichText';
import type { EmbededEmoji } from './RichTextProp';

export class RichTextParser {
  parse(text: string, emojis: EmbededEmoji[]): RichText[] {
    const regex = /\{\{([a-zA-Z0-9_-]+)\|([a-zA-Z0-9_-]+)\}\}/g;
    const result: RichText[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        result.push({ type: 'plain', text: text.slice(lastIndex, match.index) });
      }
      const type = match[1];
      const name = match[2];
      const emojiObj = emojis.find((e) => e.type === type && e.name === name);
      if (emojiObj && emojiObj.url) {
        result.push({
          type: emojiObj.type,
          name: emojiObj.name,
          url: emojiObj.url
        });
      } else {
        result.push({ type: 'plain', text: '' });
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      result.push({ type: 'plain', text: text.slice(lastIndex) });
    }
    return result;
  }
}
