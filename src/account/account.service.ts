import { Injectable, Logger } from '@nestjs/common';
import * as SocketIO from 'socket.io';
import { AccountNatsService } from './account-nats.service';
import { JwtPayloadDto } from '../common/dto/jwt.dto';
import { AomHttpException } from '../common/exceptions/aom-http-exception';
import { JWT_EXCEPTION } from '../common/constants/jwt.exception.constant';
import { AdminJwtService } from '../common/jwt/jwt.service';

@Injectable()
export class AccountService {
  private readonly logger: Logger = new Logger(AccountService.name);

  constructor(
    private adminNatsService: AccountNatsService,
    private adminJwtService: AdminJwtService,
  ) {}

  async verifyToken(token: string): Promise<JwtPayloadDto> {
    this.logger.debug(`verifyToken, token: ${token}`);
    // TODO 驗證 token
    if (!token) {
      throw new AomHttpException(JWT_EXCEPTION.NO_TOKEN);
    }
    const payload = await this.adminJwtService.jwtInstance.verifyAsync<JwtPayloadDto>(
      token,
    );
    if (!payload) {
      this.logger.warn(`token 驗證錯誤, token: ${token}`);
      throw new AomHttpException(JWT_EXCEPTION.TOKEN_UNAUTHORIZED);
    }
    return payload;
  }

  async processOnline(accountId: number, socket: SocketIO.Socket) {
    this.logger.log(
      `processOnline, accountId: ${accountId}, socketId: ${socket.id}`,
    );

    this.adminNatsService.subAdminEvent(accountId, socket);
  }

  async processOffline(accountId: number, socketId: string) {
    this.logger.log(
      `processOffline, accountId: ${accountId}, socketId: ${socketId}`,
    );

    this.adminNatsService.close(accountId, socketId);
  }
}
