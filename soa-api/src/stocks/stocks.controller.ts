import { Controller, Get, Param } from '@nestjs/common';
import { StocksService } from './stocks.service';

@Controller('stocks')
export class StocksController {
  constructor(private stocksService: StocksService) {}

  @Get()
  public async getAvailableStocks() {
    return this.stocksService.getAvailableStocks();
  }

  @Get(':id')
  public async getStockData(@Param('id') stock: string): Promise<{ date: Date; value: number }[]> {
    return this.stocksService.getStockData(stock);
  }
}
