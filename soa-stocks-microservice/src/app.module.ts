import { Module } from '@nestjs/common';
import { StockModule } from './stocks/stock.module';

@Module({
  imports: [StockModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
