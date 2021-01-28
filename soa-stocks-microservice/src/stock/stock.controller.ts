import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { StockService } from './stock.service';

@Controller('stocks')
export class StockController {
	constructor(private stockService: StockService) {}

	@MessagePattern({ cmd: 'get' })
  async getStockData(stock: string) {
    return this.stockService.loadData(stock);
  }
  
  @EventPattern('subscribe-stock')
  handleSubscribeStock(stock: string) {
    this.stockService.subscribeStock(stock);
  }
  
  @EventPattern('unsubscribe-stock')
  handleUnsubscribeStock(stock: string) {
    this.stockService.unsubscribeStock(stock);
  }
}
