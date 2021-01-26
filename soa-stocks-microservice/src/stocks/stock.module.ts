import { HttpModule, Module } from '@nestjs/common';
import { StockCronService } from './stock-cron.service';
import { StockService } from './stock.service';

@Module({
  providers: [StockService, StockCronService],
  imports: [HttpModule],
})
export class StockModule {}
