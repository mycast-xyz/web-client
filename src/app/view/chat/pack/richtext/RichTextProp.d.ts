export type RichTextProp = {
  text: string;
  emojis: EmbededEmoji[];
};

export type EmbededEmoji = {
  type: 'emoji-image';
  name: string;
  url: string;
};
