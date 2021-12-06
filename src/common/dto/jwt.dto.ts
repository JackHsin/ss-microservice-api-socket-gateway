import { Expose } from 'class-transformer';

export class JwtPayloadDto {
  @Expose()
  loginId: number;
}
