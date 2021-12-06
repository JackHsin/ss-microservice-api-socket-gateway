import { Module, RequestMethod } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { SurfingSystemSocketGateway } from './socket-gateway/surfing-system.socket.gateway';
import { AccountModule } from './account/account.module';

const {
  NODE_ENV,
  // AOM_ACCOUNT_SERVICE_API_HOST,
  // AOM_ACCOUNT_SERVICE_API_PORT,
} = process.env;
@Module({
  imports: [
    TerminusModule,
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: true,
        formatters: {
          level: (label) => ({ level: label }),
        },
        reqCustomProps: (req) => {
          return {
            accountId: req.headers['x-account-id'],
            gameId: req.headers['x-game-id'],
            clientRequestId: req.headers['x-client-request-id'],
          };
        },
        level: NODE_ENV === 'prod' ? 'info' : 'debug',
        // install 'pino-pretty' package in order to use the following option
        prettyPrint: NODE_ENV === 'local',
        // HACK 會嚴重影響效能，先使用預設的 timestamp
        // timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
      },
      exclude: [{ method: RequestMethod.GET, path: '/api/health' }],
    }),
    AccountModule,
    // AccountApiModule.forRoot(
    //   () =>
    //     new AccountConfiguration({
    //       basePath: `http://${AOM_ACCOUNT_SERVICE_API_HOST}:${AOM_ACCOUNT_SERVICE_API_PORT}/api`,
    //     }),
    // ),
  ],
  controllers: [AppController],
  providers: [SurfingSystemSocketGateway],
})
export class AppModule {}
