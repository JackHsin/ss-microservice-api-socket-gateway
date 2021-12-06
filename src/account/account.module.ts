import { Module } from '@nestjs/common';
import { AdminJwtService } from '../common/jwt/jwt.service';
import { AccountNatsService } from './account-nats.service';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [],
  controllers: [AccountController],
  exports: [AdminJwtService, AccountNatsService, AccountService],
  providers: [AdminJwtService, AccountNatsService, AccountService],
})
export class AccountModule {}
