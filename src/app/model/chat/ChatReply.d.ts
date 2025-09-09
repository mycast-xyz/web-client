export type ChatReply = {
  hash: string;
  timestamp: string;
  user: ChatReactionUser;
  value: string;
  emojis: EmbededEmoji[];
};

type ChatReactionUser = { hash: string; icon: string; nickname: string };
