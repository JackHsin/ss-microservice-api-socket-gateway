// import { V1AdminAccountsService } from '@cyrarea/aom-microservice-account-typescript-nestjs-client';
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtPayloadDto } from '../common/dto/jwt.dto';
import { CurrentAccount } from '../common/decorators/current-account';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminAccountInfoAO } from './ao/account.ao';

@ApiTags('v1/account')
@Controller('v1/account')
export class AccountController {
  constructor(
    // private readonly v1AdminAccountsService: V1AdminAccountsService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '獲取用戶資料' })
  @ApiOkResponse({
    type: AdminAccountInfoAO,
  })
  @Get()
  async getAdminAccountInfo(@CurrentAccount() userInfo: JwtPayloadDto) {
    const { loginId } = userInfo;
    // const { data } = await this.v1AdminAccountsService
    //   .getAdminAccountInfo(loginId)
    //   .toPromise();

    // return AdminAccountInfoAO.plainToClass(data);
  }
}
