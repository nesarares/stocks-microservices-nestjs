import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { StocksService } from './stocks.service';

@Controller('stocks')
@UseGuards(AuthGuard)
export class StocksController {
  constructor(private stocksService: StocksService) {}

  @Get()
  public async getAvailableStocks() {
    return this.stocksService.getAvailableStocks();
  }

  @Get(':id')
  public async getStockData(
    @Param('id') stock: string,
  ): Promise<{ date: Date; value: number }[]> {
    return this.stocksService.getStockData(stock);
  }
}
