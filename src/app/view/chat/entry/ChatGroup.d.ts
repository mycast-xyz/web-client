import type { ChatMessage } from '../../../model/chat/ChatMessage';

export type ChatGroup = {
  hash: string;
  nickname: string;
  icon: string;
  senderType: ChatEntryPropType;
  senderId?: string;
  owner?: { hash: string; nickname: string; icon: string };
  messages: ChatMessage[];
};

export type ChatEntryPropType = 'PC' | 'MOBILE' | 'BOT' | 'USER_BOT';
