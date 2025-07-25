export interface SocketModel {
  send(request: SocketRequest): void;
  onReceived(callback: SocketCallback): void;
  connect(): void;
  disconnect(): void;
}

export type SocketRequest =
  | SocketLoginRequest
  | SocketChatRequest
  | SocketModifyProfileRequest
  | SocketNotifyUserRequest
  | SocketReactionRequest
  | SocketReplyRequest;

type SocketLoginRequest = {
  commandType: 'user-login';
  resource: {
    channel: 'chat';
    privateKey: string;
  };
};

type SocketChatRequest = {
  commandType: 'chat';
  resource: {
    userKey: string;
    msg: string;
    type: string;
  };
};

type SocketModifyProfileRequest = {
  commandType: 'modify-profile';
  resource: {
    privateKey: string;
    userInfo: {
      icon: string;
      nickname: string;
      statusMessage: string;
    };
  };
};

type SocketNotifyUserRequest = {
  commandType: 'notify-user';
  resource: {
    from: string;
    to: string;
  };
};

type SocketReactionRequest = {
  commandType: 'reaction';
  resource: {
    userKey: string;
    chatHash: string;
    reaction: string;
  };
};

type SocketReplyRequest = {
  commandType: 'reply';
  resource: {
    userKey: string;
    chatHash: string;
    reply: string;
  };
};

export type SocketCallback = (response: SocketCommand) => void;

export type SocketCommand =
  | SocketChatCommand
  | SocketLinkUpdateCommand
  | SocketUpdateClipsCommand
  | SocketApplyMyStatusCommand
  | SocketCurrentChatsCommand
  | SocketCurrentUsersCommand
  | SocketCurrentBotsCommand
  | SocketNotificationFromCommand
  | SocketNotificationToCommand
  | SocketReactionCommand
  | SocketReplyCommand;

type BaseSocketCommand<T, Request, Response> = {
  hash: string;
  commandType: T;
  request: Request;
  response: Response;
};

type SocketChatCommand = BaseSocketCommand<'chat', null, SocketCurrentChat>;

type SocketMyStatus = {
  coin: number;
  exp: number;
  icon: string;
  iconBorderColor: string;
  level: number;
  need: number;
  nickname: string;
  statusMessage: string;
};

type SocketLinkUpdateCommand = BaseSocketCommand<'link-update', null, SocketLinkUpdateResponse>;

type SocketLinkUpdateResponse = {
  chatHash: string;
  thumbnail: string;
  title: string;
};

type SocketUpdateClipsCommand = BaseSocketCommand<'drawer-update', null, SocketCurrentLinkClip[]>;

type SocketCurrentLinkClip = {
  data: { link: string; title: string };
  hash: string;
  type: 'link';
};

type SocketApplyMyStatusCommand = BaseSocketCommand<'applyMyStatus', null, SocketMyStatus>;

type SocketCurrentChat = {
  hash: string;
  icon: string;
  iconBorderColor: string;
  isMobile: boolean;
  isSystemChat: boolean;
  level: number;
  msg: {
    request: any; // TODO: remove any
    response: any; // TODO: remove any
  };
  nickname: string;
  reactions: {
    hash: string;
    timestamp: string;
    user: { hash: string; icon: string; nickname: string };
    value: string;
  }[];
  replies: {
    hash: string;
    timestamp: string;
    user: { hash: string; icon: string; nickname: string };
    value: string;
  }[];
  timestamp: string;
  type: string; // TODO: make type
};

type SocketCurrentChatsCommand = BaseSocketCommand<
  'applyCurrentChatList',
  null,
  SocketCurrentChat[]
>;

type SocketCurrentUser = {
  computer: boolean;
  hash: string;
  icon: string;
  level: number;
  mobile: boolean;
  nickname: string;
};

type SocketCurrentUsersCommand = BaseSocketCommand<
  'applyCurrentUserList',
  null,
  SocketCurrentUser[]
>;

type SocketCurrentBot = {
  hash: string;
  icon: string;
  nickname: string;
  defaultMute: boolean;
};

type SocketCurrentBotsCommand = BaseSocketCommand<'applyCurrentBotList', null, SocketCurrentBot[]>;

type SocketNotificationFromResponse = {
  from: { icon: string; nickname: string };
  timestamp: string;
};

type SocketNotificationFromCommand = BaseSocketCommand<
  'applyNotifyFrom',
  null,
  SocketNotificationFromResponse
>;

type SocketNotificationToResponse = {
  result: boolean;
  to: string;
};

type SocketNotificationToCommand = BaseSocketCommand<
  'applyNotifyTo',
  null,
  SocketNotificationToResponse
>;

type SocketReactionResponse = {
  chatHash: string;
  reactions: {
    hash: string;
    timestamp: string;
    user: { hash: string; icon: string; nickname: string };
    value: string;
  }[];
};

type SocketReactionCommand = BaseSocketCommand<'reaction', null, SocketReactionResponse>;

type SocketReplyResponse = {
  chatHash: string;
  replies: {
    hash: string;
    timestamp: string;
    user: { hash: string; icon: string; nickname: string };
    value: string;
  }[];
};

type SocketReplyCommand = BaseSocketCommand<'reply', null, SocketReplyResponse>;
