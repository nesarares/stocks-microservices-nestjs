import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { availableStocks } from './available-stocks';

@Controller('stocks')
@UseGuards(AuthGuard)
export class StocksController {
  constructor(@Inject('STOCKS_SERVICE') private stocksClient: ClientProxy) {}

  @Get()
  public async getAvailableStocks() {
    return availableStocks;
  }

  @Get(':id')
  public async getStockData(@Param('id') stock: string): Promise<{ date: number; value: number }[]> {
    const data = await this.stocksClient.send({ cmd: 'get' }, stock).toPromise();
    return data;
  }
}
