import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToClass } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
// import { AdminAccountInfoAO as IAdminAccountInfoAO } from '@cyrarea/aom-microservice-account-typescript-nestjs-client';

export class AdminAccountInfoAO {
  @ApiProperty()
  @IsNumber()
  @Expose()
  id: number;

  @ApiProperty()
  @IsString()
  @Expose()
  thirdPartyLoginId: string;

  @ApiProperty()
  @IsString()
  @Expose()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Expose()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Expose()
  avatar?: string;

  static plainToClass(dto: any) {
    return plainToClass(AdminAccountInfoAO, dto, {
      excludeExtraneousValues: true,
    });
  }
}
