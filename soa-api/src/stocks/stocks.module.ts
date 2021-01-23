import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { config } from 'src/config';
import { SharedModule } from 'src/shared/shared.module';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';

@Module({
  imports: [SharedModule],
  controllers: [StocksController],
  providers: [StocksService],
})
export class StocksModule {}
