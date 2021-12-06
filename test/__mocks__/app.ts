import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { CustomStrategy } from '@nestjs/microservices';
import {
  Listener,
  Publisher,
} from '@nestjs-plugins/nestjs-nats-streaming-transport';

const {
  AOM_SERVICE_NAME,
  AOM_NATS_STREAMING_CLUSTER_ID,
  AOM_NATS_STREAMING_HOST,
  AOM_NATS_STREAMING_PORT,
} = process.env;

export async function createApp() {
  const fixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const microserviceOptions: CustomStrategy = {
    strategy: new Listener(
      AOM_NATS_STREAMING_CLUSTER_ID,
      `${AOM_SERVICE_NAME}-listener`,
      AOM_SERVICE_NAME,
      {
        url: `nats://${AOM_NATS_STREAMING_HOST}:${AOM_NATS_STREAMING_PORT}`,
      },
      {
        durableName: `${AOM_SERVICE_NAME}-queue`,
        manualAckMode: true,
        deliverAllAvailable: true,
        ackWait: 2 * 1000,
      },
    ),
  };
  const app = fixture.createNestMicroservice(microserviceOptions);

  await app.listenAsync();

  return app.init();
}

export async function createPublisher() {
  const publisher = new Publisher({
    clientId: `testing-publisher`,
    clusterId: AOM_NATS_STREAMING_CLUSTER_ID,

    connectOptions: {
      url: `nats://${AOM_NATS_STREAMING_HOST}:${AOM_NATS_STREAMING_PORT}`,
    },
  });
  await publisher.connect();
  return publisher;
}
