export type ChatReactionItemParam = ChatEmojiReactionItemParam | ChatImageReactionItemParam;

type ChatEmojiReactionItemParam = {
  type: 'emoji';
  value: string;
  users: { hash: string; icon: string; nickname: string }[];
};

type ChatImageReactionItemParam = {
  type: 'emoji-image';
  value: {
    url: string;
    name: string;
  };
  users: { hash: string; icon: string; nickname: string }[];
};
