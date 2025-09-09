export type ChatReaction = ChatEmojiReaction | ChatImageReaction;

type ChatEmojiReaction = {
  hash: string;
  timestamp: string;
  type: 'emoji';
  user: ChatReactionUser;
  value: string;
};

type ChatImageReaction = {
  hash: string;
  timestamp: string;
  type: 'emoji-image';
  user: ChatReactionUser;
  value: { url: string; name: string };
};

type ChatReactionUser = { hash: string; icon: string; nickname: string };
