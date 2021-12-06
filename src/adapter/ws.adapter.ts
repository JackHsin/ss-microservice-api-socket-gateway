import * as WebSocket from 'ws';
import {
  WebSocketAdapter,
  INestApplicationContext,
  Logger,
} from '@nestjs/common';
import { MessageMappingProperties } from '@nestjs/websockets';
import { Observable, fromEvent, EMPTY } from 'rxjs';
import { mergeMap, filter } from 'rxjs/operators';

export class WSAdapter implements WebSocketAdapter {
  private readonly logger: Logger = new Logger(WSAdapter.name);

  constructor(private app: INestApplicationContext) {}

  create(port: number, options: any = {}): any {
    this.logger.log(`ws created:, ${port}`);
    return new WebSocket.Server({ port, ...options });
  }

  bindClientConnect(server, callback: any) {
    this.logger.log('ws bind Client Connect');
    server.on('connection', callback);
  }

  bindMessageHandlers(
    client: WebSocket,
    handlers: MessageMappingProperties[],
    process: (data: any) => Observable<any>,
  ) {
    this.logger.log('[wsAdapter] bindMessageHandlers');

    fromEvent(client, 'message')
      .pipe(
        mergeMap((data) =>
          this.bindMessageHandler(client, data, handlers, process),
        ),
        filter((result) => result),
      )
      .subscribe((response) => client.send(JSON.stringify(response)));
  }

  bindMessageHandler(
    client: WebSocket,
    buffer,
    handlers: MessageMappingProperties[],
    process: (data: any) => Observable<any>,
  ): Observable<any> {
    this.logger.log('[wsAdapter] bindMessageHandler');
    let message = null;
    try {
      message = JSON.parse(buffer.data);
    } catch (error) {
      this.logger.error('ws json parsing error: ', error);
      return EMPTY;
    }

    const messageHandler = handlers.find(
      (handler) => handler.message === message.event,
    );
    if (!messageHandler) {
      return EMPTY;
    }
    return process(messageHandler.callback(message.data));
  }

  close(server) {
    this.logger.error('ws server closed');
    server.close();
  }
}
