export class ChatSender {
  readonly icon: string;
  readonly nickname: string;
  readonly type: ChatSenderType;

  constructor(icon: string, nickname: string, type: ChatSenderType,
    readonly id?: string, readonly owner?: { hash: string; nickname: string; icon: string }) {
    this.icon = icon;
    this.nickname = nickname;
    this.type = type;
  }

  static equals(a: ChatSender, b: ChatSender) {
    if (a.type === 'USER_BOT' || b.type === 'USER_BOT') {
      return a.type === b.type && a.id === b.id && a.owner?.hash === b.owner?.hash &&
        a.owner?.nickname === b.owner?.nickname && a.icon === b.icon && a.nickname === b.nickname;
    }
    return a.icon === b.icon && a.nickname === b.nickname && a.type === b.type;
  }
}

type ChatSenderType = 'PC' | 'BOT' | 'MOBILE' | 'USER_BOT';
