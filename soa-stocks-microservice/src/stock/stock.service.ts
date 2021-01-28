import { HttpService, Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { debounceTime, map, throttleTime } from 'rxjs/operators';
import { keys } from 'src/keys';
import { RedisService } from 'src/redis/redis.service';
import * as WebSocket from 'ws';

const finnhubBaseUrl = 'https://finnhub.io/api/v1';
const finnhubHeaders = {
  'X-Finnhub-Token': keys.finnhubKey,
};

@Injectable()
export class StockService {
  ws: WebSocket;
  stockSubscriptions: { [key: string]: number } = {};
  eventSubject = new Subject<{ channel: string; value: unknown }>();

  constructor(private http: HttpService, private redisService: RedisService) {
    this.initFinnhubWs();

    this.eventSubject
      .asObservable()
      .pipe(throttleTime(1000))
      .subscribe(({ channel, value }) => {
        this.redisService.publish(channel, value);
      });
  }

  private async initFinnhubWs() {
    const ws = new WebSocket(`wss://ws.finnhub.io?token=${keys.finnhubKey}`);
    this.ws = ws;

    ws.on('open', () => {
      console.log(`Connected to finnhub websocket.`);
    });

    ws.on('message', (data) => {
      const obj = JSON.parse(data.toString());

      if (obj?.type === 'ping') {
        console.log('Received ping');
        ws.send(JSON.stringify({ type: 'pong' }));
      }

      if (obj.data) {
        const dta = obj.data;
        const prices: { [key: string]: number } = {};
        for (let i = dta.length - 1; i >= 0; i--) {
          const symbol = dta[i].s;
          if (!prices[symbol]) {
            prices[symbol] = dta[i].p;
          }
        }

        this.eventSubject.next({
          channel: 'stocks',
          value: prices
        });
      }
    });

    ws.on('error', (err) => {
      console.error(err);
    });
  }

  public async loadData(stock: string) {
    const now = Math.floor(new Date().getTime() / 1000);
    const lastWeek = Math.floor(new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7).getTime() / 1000);
    const result = await this.http
      .get(`${finnhubBaseUrl}/stock/candle`, {
        headers: finnhubHeaders,
        params: {
          symbol: stock,
          resolution: '15',
          from: lastWeek.toString(),
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

  public subscribeStock(stock: string) {
    if (!this.stockSubscriptions[stock]) {
      this.stockSubscriptions[stock] = 1;
    } else {
      this.stockSubscriptions[stock]++;
    }

    if (this.stockSubscriptions[stock] === 1) {
      this.ws.send(JSON.stringify({ type: 'subscribe', symbol: stock }));
      console.log(`Sent subscribe for ${stock}`);
    }
  }

  public unsubscribeStock(stock: string) {
    if (this.stockSubscriptions[stock] == null) return;
    if (this.stockSubscriptions[stock] > 0) {
      this.stockSubscriptions[stock]--;
      this.ws.send(JSON.stringify({ type: 'unsubscribe', symbol: stock }));
      console.log(`Sent unsubscribe for ${stock}`);
    }
  }
}
