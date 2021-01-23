import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { StocksModule } from './stocks/stocks.module';

@Module({
  imports: [StocksModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
