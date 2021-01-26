import { HttpModule, Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';

@Module({
  providers: [StockService],
  imports: [HttpModule],
  controllers: [StockController],
})
export class StockModule {}
