import { describe, expect, it } from 'vitest';
import type { RichText } from './RichText';
import { RichTextParser } from './RichTextParser';
import type { EmbededEmoji } from './RichTextProp';

describe('RichTextParser', () => {
  const parser = new RichTextParser();

  it('should parse text and emojis correctly', () => {
    const text = 'Hello {{emoji-image|smile}} world {{emoji-image|heart}}!';
    const emojis: EmbededEmoji[] = [
      { type: 'emoji-image', name: 'smile', url: 'smile.png' },
      { type: 'emoji-image', name: 'heart', url: 'heart.png' }
    ];
    const result = parser.parse(text, emojis);
    expect(result).toEqual<RichText[]>([
      { type: 'plain', text: 'Hello ' },
      { type: 'emoji-image', name: 'smile', url: 'smile.png' },
      { type: 'plain', text: ' world ' },
      { type: 'emoji-image', name: 'heart', url: 'heart.png' },
      { type: 'plain', text: '!' }
    ]);
  });

  it('should handle missing emoji gracefully', () => {
    const text = 'Test {{emoji-image|star}} and {{emoji-image|moon}}.';
    const emojis: EmbededEmoji[] = [{ type: 'emoji-image', name: 'star', url: 'star.png' }];
    const result = parser.parse(text, emojis);
    expect(result).toEqual([
      { type: 'plain', text: 'Test ' },
      { type: 'emoji-image', name: 'star', url: 'star.png' },
      { type: 'plain', text: ' and ' },
      { type: 'plain', text: '' },
      { type: 'plain', text: '.' }
    ]);
  });

  it('should return only text if no emoji markers', () => {
    const text = 'Just plain text.';
    const emojis: EmbededEmoji[] = [];
    const result = parser.parse(text, emojis);
    expect(result).toEqual([{ type: 'plain', text: 'Just plain text.' }]);
  });
});
