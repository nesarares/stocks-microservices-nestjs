import { HttpService, Injectable } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { keys } from 'src/keys';
import * as WebSocket from 'ws';

const finnhubBaseUrl = 'https://finnhub.io/api/v1';
const finnhubHeaders = {
  'X-Finnhub-Token': keys.finnhubKey,
};

@Injectable()
export class StockService {
  constructor(private http: HttpService) {}

  async loadData(stock: string) {
    const now = Math.floor(new Date().getTime() / 1000);
    const lastDay = Math.floor(new Date(new Date().getTime() - 1000 * 60 * 60 * 24).getTime() / 1000);
    const result = await this.http
      .get(`${finnhubBaseUrl}/stock/candle`, {
        headers: finnhubHeaders,
        params: {
          symbol: stock,
          resolution: '5',
          from: lastDay.toString(),
          to: now.toString(),
        },
      })
      .pipe(
        map(({ data }) => {
          if (data && data.s === 'ok') {
            const { c } = data;
            return (data.t as number[]).map((timestamp, index) => ({
              date: timestamp,
              value: c[index],
            }));
          } else {
            return [];
          }
        }),
      )
      .toPromise();

    return result;
  }

  async subscribeToStocks() {
    const ws = new WebSocket(`wss://ws.finnhub.io?token=${keys.finnhubKey}`);
    ws.on('open', () => {
      ws.send(JSON.stringify({ type: 'subscribe', symbol: 'AAPL' }));
    });
  }
}
