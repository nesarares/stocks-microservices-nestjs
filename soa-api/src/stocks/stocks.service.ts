import { Injectable } from '@nestjs/common';

@Injectable()
export class StocksService {
  public async getAvailableStocks() {
    return ['AAPL', 'DPZ', 'TWLO', 'GOOGL'];
  }

  public async getStockData(stock: string) {
    const data = [];
    let value = 50;
    for (let i = 0; i < 300; i++) {
      const date = new Date(new Date().getTime() - i * 5 * 1000);
      value -= Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
      data.push({ date: date, value: value });
    }
    return data.reverse();
  }
}
