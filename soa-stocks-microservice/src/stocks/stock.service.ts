import { HttpService, Injectable } from '@nestjs/common';
import { config } from 'src/config';
import { map } from 'rxjs/operators';
import * as WebSocket from 'ws';

const finnhubBaseUrl = 'https://finnhub.io/api/v1';
const finnhubHeaders = {
  'X-Finnhub-Token': config.finnhubKey,
};

@Injectable()
export class StockService {
  constructor(private http: HttpService) {
		// this.loadData();
		this.subscribeToStocks();
  }

  async loadData() {
    const now = Math.floor(new Date().getTime() / 1000);
    const lastDay = Math.floor(new Date(new Date().getTime() - 1000 * 60 * 60 * 24).getTime() / 1000);
    const result = await this.http
      .get(`${finnhubBaseUrl}/crypto/candle`, {
        headers: finnhubHeaders,
        params: {
          symbol: 'AAPL',
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
              date: new Date(timestamp * 1000),
              value: c[index],
            }));
          } else {
            return [];
          }
        }),
      )
      .toPromise();

    console.log(result);
	}
	
	async subscribeToStocks() {
		const ws = new WebSocket(`wss://ws.finnhub.io?token=${config.finnhubKey}`);
		ws.on('open', () => {
			ws.send(JSON.stringify({'type': 'subscribe', 'symbol': 'AAPL'}))
		});
	}
}
