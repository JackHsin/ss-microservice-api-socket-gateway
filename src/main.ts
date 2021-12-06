import './setup-env';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as pack from '../package.json';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AomHttpException } from './common/exceptions/aom-http-exception';
import { COMMON_EXCEPTION } from './common/constants/exception.constant';
import { Logger } from 'nestjs-pino';
import * as hpropagate from 'hpropagate';
// import { WSAdapter } from './adapter/ws.adapter';
import { WsAdapter } from '@nestjs/platform-ws';
hpropagate({
  propagateInResponses: true,
  headersToPropagate: [
    'x-request-id',
    'x-b3-traceid',
    'x-b3-spanid',
    'x-b3-parentspanid',
    'x-b3-sampled',
    'x-b3-flags',
    'x-ot-span-context',
    'x-variant-id',
    'x-feature-flags',
    'x-account-id',
    'x-game-id',
    'x-client-request-id',
  ],
});
async function bootstrap() {
  const { NODE_ENV, AOM_SERVICE_API_HOST, AOM_SERVICE_API_PORT } = process.env;
  const app = await NestFactory.create(AppModule, {
    // HACK work around https://github.com/iamolegga/nestjs-pino/issues/387
    logger: NODE_ENV === 'local',
  });
  app.useLogger(app.get(Logger));
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const message = errors.reduce(
          (text, error, index) =>
            (text += `${Object.values(error.constraints)} ${
              index === errors.length - 1 ? '.' : ', '
            }`),
          '',
        );
        return new AomHttpException({
          ...COMMON_EXCEPTION.PIPE_VALID_EXCEPTION,
          message,
        });
      },
      transform: true,
      whitelist: true,
    }),
  );
  const options = new DocumentBuilder()
    .setTitle(pack.name)
    .setDescription(pack.description)
    .setVersion(pack.version)
    .addServer(`http://${AOM_SERVICE_API_HOST}:${AOM_SERVICE_API_PORT}/api`)
    .addServer(`http://${AOM_SERVICE_API_HOST}:4010`)
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, options, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });
  SwaggerModule.setup('api', app, document);
  app.useGlobalFilters(new HttpExceptionFilter()).setGlobalPrefix('api');

  app.useWebSocketAdapter(new WsAdapter(app));
  await app.startAllMicroservicesAsync();
  await app.listen(AOM_SERVICE_API_PORT);
}
bootstrap();
