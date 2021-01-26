import { Module } from '@nestjs/common';
import { StockModule } from './stock/stock.module';

@Module({
  imports: [StockModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
