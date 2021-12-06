import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { adminPublicKey } from '../constants/key.constant';

@Injectable()
export class AdminJwtService {
  jwtInstance = new JwtService({
    publicKey: adminPublicKey,
    verifyOptions: {
      ignoreExpiration: false,
      algorithms: ['RS256'],
    },
  });
}
