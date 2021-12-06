import { Injectable, Logger } from '@nestjs/common';
import { Server } from '@nestjs/microservices';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { WsPayloadData } from '../common/dto/ws-socket.dto';
import { AccountService } from '../account/account.service';

@Injectable()
@WebSocketGateway(3067, {
  pingInterval: 100,
  pingTimeout: 5.5 * 1000,
  transports: ['websocket'],
})
export class SurfingSystemSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  wsClients: Record<string, Socket[]> = {};
  private readonly logger: Logger = new Logger(SurfingSystemSocketGateway.name);

  constructor(private readonly accountService: AccountService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: Server): void {
    this.logger.debug('afterInit');
  }

  /**
   * Hack: Due to the current frontend can only connect to websocket in nestjs.
   * Using a compromised way to get game(channel name) from url or data payload to implement the game separated broadcast.
   * TODO: When frontend change to a new structure like React, use Socket.IO for backend here, it provides a comprehensive tool to do room(channel) and broadcast.
   */

  handleConnection(client: Socket, ...args: any[]) {
    console.log('\x1b[32m', '\n-----------handleConnection-------------\n');

    const url = args[0].url;
    const game = url.split('/')[2];

    if (!this.wsClients[game]) {
      this.wsClients[game] = [client];
    } else {
      this.wsClients[game].push(client);
    }
  }

  handleDisconnect(client: Socket) {
    // console.log('\x1b[32m', '\n-----------handleDisConnection-------------\n');

    Object.keys(this.wsClients).forEach((game) => {
      for (let i = 0; i < this.wsClients[game].length; i++) {
        if (this.wsClients[game][i] === client) {
          this.wsClients[game].splice(i, 1);
          break;
        }
      }
    });
  }

  private broadcast(game: string, data: any) {
    console.log('\x1b[32m', `\n-----------broadcast to ${game}-------------\n`);
    const broadCastData = JSON.stringify(data);
    for (let i = 0; i < this.wsClients[game].length; i++) {
      this.wsClients[game][i].send(broadCastData);
    }
  }

  @SubscribeMessage('message')
  message(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: WsPayloadData,
  ) {
    console.log('\x1b[32m', '\n--------------Debug----------------\n');
    console.log('\x1b[36m', `data = `, data);
    console.log('\x1b[32m', '\n-----------------------------------', '\x1b[0m');
    const game = data.game;
    this.broadcast(game, data);
  }
}
