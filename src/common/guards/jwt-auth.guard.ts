import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { AomHttpException } from '../exceptions/aom-http-exception';
import { JWT_EXCEPTION } from '../constants/jwt.exception.constant';
import { JwtPayloadDto } from '../dto/jwt.dto';
import { AdminJwtService } from '../jwt/jwt.service';
const { TOKEN_UNAUTHORIZED, NO_TOKEN } = JWT_EXCEPTION;

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger: Logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly adminJwtService: AdminJwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let { authorization: token } = request.headers;

    if (!token) {
      throw new AomHttpException(NO_TOKEN);
    }

    // Get rid of 'Bearer' prefix
    token = token.split(' ')[1];

    try {
      const payload = await this.adminJwtService.jwtInstance.verifyAsync<JwtPayloadDto>(
        token,
      );

      if (!payload) {
        this.logger.warn(`token 驗證錯誤, token: ${token}`);
        throw new AomHttpException(TOKEN_UNAUTHORIZED);
      }

      request.userInfo = payload;

      return true;
    } catch (error) {
      if (error instanceof AomHttpException) {
        throw error;
      }
      this.logger.warn(`token jwt-auth 未知的錯誤, token: ${token}`);
      this.logger.error(error);
      throw new AomHttpException(TOKEN_UNAUTHORIZED);
    }
  }
}
