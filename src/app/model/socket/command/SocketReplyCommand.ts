import type { SocketModel } from '../common/SocketModel';

export class SocketReplyCommand {
  #socket: SocketModel;

  constructor(socket: SocketModel) {
    this.#socket = socket;
  }

  execute(privateKey: string, chatHash: string, reply: string): void {
    this.#socket.send({
      commandType: 'reply',
      resource: {
        userKey: privateKey,
        chatHash,
        reply
      }
    });
  }
}
