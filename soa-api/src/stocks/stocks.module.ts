import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { config } from 'src/config';
import { SharedModule } from 'src/shared/shared.module';
import { StocksController } from './stocks.controller';
import { StocksGateway } from './stocks.gateway';

@Module({
  imports: [
    SharedModule,
    ClientsModule.register([
      {
        name: 'STOCKS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: config.stocksHost,
          port: config.stocksPort,
        },
      },
    ]),
  ],
  controllers: [StocksController],
  providers: [StocksGateway],
})
export class StocksModule {}
