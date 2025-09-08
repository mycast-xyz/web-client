export type CustomEmoji = {
  idx: number;
  name: string;
  src: string;
  thumbnailUrl?: string;
};

export type CustomEmojiDetail = {
  imageHash: string;
  name: string;
  regDate: string;
  thumbnailUrl: string;
  type: string;
  uploader: {
    nickname: string;
    icon: string;
  };
};
