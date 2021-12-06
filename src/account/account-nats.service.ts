import { Injectable, Logger } from '@nestjs/common';
import * as SocketIO from 'socket.io';
import { connect, JSONCodec, NatsConnection, Subscription } from 'nats';
import { NatsPubBodyDTO } from '../common/dto/nats.dto';
import { Util } from '../common/util';
import { ReadPacket } from '@nestjs/microservices';

@Injectable()
export class AccountNatsService {
  private readonly logger: Logger = new Logger(AccountNatsService.name);

  private accountMap: {
    [accountId in string]: {
      [socketId in string]: { subMap: { [subject in string]: Subscription } };
    };
  } = {};

  private nats: NatsConnection;
  constructor() {
    this.init();
  }

  private async init() {
    this.nats = await connect({
      servers: `nats://${process.env.AOM_ADMIN_NATS_HOST}:${process.env.AOM_ADMIN_NATS_PORT}`,
      // debug: process.env.NODE_ENV !== 'prod',
      debug: false,
      waitOnFirstConnect: true,
    });

    await (async () => {
      this.logger.log(`connected ${this.nats.getServer()}`);
      for await (const status of this.nats.status()) {
        this.logger.log(`nats ${status.type}: ${status.data}`);
      }
    })();
  }

  public subAdminEvent(accountId: number, socket: SocketIO.Socket) {
    // opts.setMaxInFlight(1);
    // 個人事件
    const adminEventSubject = this.getAdminEventSubject(accountId);
    this.initSub(accountId, socket, adminEventSubject);

    // 給所有人事件
    const allAdminEventSubject = this.getAllAdminEventSubject();
    this.initSub(accountId, socket, allAdminEventSubject);
  }

  // XXX 未來需注意是否有 memory leak 問題
  public close(accountId: number, socketId: string) {
    if (this.accountMap[accountId] && this.accountMap[accountId][socketId]) {
      Object.entries(this.accountMap[accountId][socketId].subMap).forEach(
        ([subject, subscription]) => {
          subscription.unsubscribe();
          this.accountMap[accountId][socketId].subMap[subject] = null;
          delete this.accountMap[accountId][socketId].subMap[subject];
        },
      );

      this.accountMap[accountId][socketId] = null;
      delete this.accountMap[accountId][socketId];

      const adminSocketIds = Object.keys(this.accountMap[accountId]);
      if (adminSocketIds.length === 0) {
        this.accountMap[accountId] = null;
        delete this.accountMap[accountId];
      }
    }
  }

  private async initSub(
    accountId: number,
    socket: SocketIO.Socket,
    subject: string,
  ) {
    if (!this.accountMap[accountId]) {
      this.accountMap[accountId] = {};
    }
    if (!this.accountMap[accountId][socket.id]) {
      this.accountMap[accountId][socket.id] = { subMap: {} };
    }
    this.accountMap[accountId][socket.id].subMap[
      subject
    ] = await this.nats.subscribe(subject, {
      callback: (err, msg) => {
        if (err) {
          this.logger.error(
            `accountId: ${accountId}, socketId: ${
              socket.id
            }, subject: ${subject}, error: ${Util.printObject(err)}`,
          );
          return;
        }
        const data = NatsPubBodyDTO.plainToClass(
          (JSONCodec().decode(msg.data) as ReadPacket).data,
        );

        const { event, payload } = data;

        this.logger.log(
          `sub: accountId: ${accountId}, socketId: ${socket.id}, subject: ${subject}, event: ${event}`,
        );
        socket.emit('json-rpc:event', {
          // ...payload,
          method: event,
          data: payload,
        });
      },
    });
  }

  private getAdminEventSubject = (accountId: number) =>
    `event.admins.${accountId}`;

  private getAllAdminEventSubject = () => `event.admins.all`;
}
