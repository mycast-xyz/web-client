export type RichText = RichTextPlain | RichTextEmojiImage;

type RichTextPlain = {
  type: 'plain';
  text: string;
};

type RichTextEmojiImage = {
  type: 'emoji-image';
  name: string;
  url: string;
};
