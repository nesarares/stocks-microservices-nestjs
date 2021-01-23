import { Module } from '@nestjs/common';
import { StocksModule } from './stocks/stocks.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [StocksModule, SharedModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
