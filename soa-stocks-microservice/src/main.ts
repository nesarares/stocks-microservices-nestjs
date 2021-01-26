import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { config } from './config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: config.stocksHost,
        port: config.stocksPort,
      },
    },
  );
  app.listen(() => console.log('Stocks microservice is listening'));
}
bootstrap();
