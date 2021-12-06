import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { healthCheckAO } from './common/ao/app.ao';
import { AomHttpException } from './common/exceptions/aom-http-exception';
import { COMMON_EXCEPTION } from './common/constants/exception.constant';

const { INTERNAL_SERVER_EXCEPTION } = COMMON_EXCEPTION;
const { AOM_NATS_STREAMING_HOST } = process.env;

@Controller()
export class AppController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    @InjectPinoLogger(AppController.name) private readonly logger: PinoLogger,
  ) {}

  @Get('health')
  @HealthCheck()
  @ApiOkResponse({
    type: () => healthCheckAO,
  })
  healthCheck(): Promise<HealthCheckResult> {
    return this.health
      .check([
        () =>
          this.http.pingCheck(
            'nats-streaming',
            `http://${AOM_NATS_STREAMING_HOST}:8222`,
          ),
        // TODO 如果有其他第三方 dependency，依序加 health check
        // () => {}
      ])
      .catch((error) => {
        throw new AomHttpException({
          ...INTERNAL_SERVER_EXCEPTION,
          message: error,
        });
      });
  }
}
