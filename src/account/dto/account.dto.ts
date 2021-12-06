import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class AdminAccountIdDTO {
  @Transform(({ value }) => Number(value))
  @ApiProperty({ description: '用戶ID' })
  @IsNumber()
  id: number;
}
