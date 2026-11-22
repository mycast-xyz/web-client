import { describe, it, expect } from 'vitest';
import { uploadedVideoUrl } from './UploadedVideo';
const url = 'https://mycast.xyz:9011/video/12345678-1234-1234-1234-123456789abc/watch';
describe('uploaded video messages', () => {
  it('recognizes persisted plain, rich text, and automatic link cards', () => {
    expect(uploadedVideoUrl('chat', url)).toBe(url);
    expect(uploadedVideoUrl('rich-text', JSON.stringify({ text: url, emojis: [] }))).toBe(url);
    expect(uploadedVideoUrl('link', JSON.stringify({ uri: url, info: { title: 'clip' } }))).toBe(
      url
    );
  });
  it('leaves unrelated, malformed and untrusted links alone', () => {
    for (const value of [
      url.replace('mycast.xyz', 'attacker.test'),
      url.replace('https:', 'http:'),
      url + '?file=other',
      url + '#hash',
      url.replace('https://', 'https://user@'),
      'hello ' + url
    ]) {
      expect(uploadedVideoUrl('chat', value)).toBeNull();
    }
    expect(uploadedVideoUrl('link', 'broken JSON')).toBeNull();
    expect(uploadedVideoUrl('image', url)).toBeNull();
  });
});
