export type RichText = RichTextPlain | RichTextEmojiImage | RichTextEmojiImages;

type RichTextPlain = {
  type: 'plain';
  text: string;
};

type RichTextEmojiImage = {
  type: 'emoji-image';
  name: string;
  url: string;
};

type RichTextEmojiImages = {
  type: 'emoji-images';
  emojis: { name: string; url: string }[];
};
