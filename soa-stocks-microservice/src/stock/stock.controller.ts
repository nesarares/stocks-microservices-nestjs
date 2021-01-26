import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { StockService } from './stock.service';

@Controller('stocks')
export class StockController {
	constructor(private stockService: StockService) {}

	@MessagePattern({ cmd: 'get' })
  async getStockData(stock: string) {
    return this.stockService.loadData(stock);
  }
}
