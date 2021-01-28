import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Utils } from '../utils/utils';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  subjects: { [stock: string]: Subject<number> } = {};
  socket: SocketIOClient.Socket;

  constructor(private http: HttpClient, private authService: AuthService) {}

  async connectSocket() {
    const token = await this.authService.getAccessTokenSilently().toPromise();

    this.socket = io(environment.socketEndpoint, {
      transports: ['websocket'],
      query: { token },
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    this.socket.on('error', (err) => {
      console.error(err);
    });
  }

  async getAvailableStocks() {
    return this.http
      .get<{ symbol: string; name: string }[]>(`api/stocks`)
      .pipe(
        map((result) => {
          return result.map((stock) => ({
            symbol: stock.symbol,
            name: Utils.titleCase(stock.name),
          }));
        })
      )
      .toPromise();
  }

  async getChartData(stock: string): Promise<{ date: Date; value: number }[]> {
    return this.http
      .get<{ date: number; value: number }[]>(`api/stocks/${stock}`)
      .pipe(
        map((data) => {
          return data.map((data) => ({
            value: data.value,
            date: new Date(data.date * 1000),
          }));
        })
      )
      .toPromise();
  }

  async subscribeToStock(stock: string) {
    if (this.subjects[stock]) {
      return this.subjects[stock].asObservable();
    }

    const stockSubject = new Subject<number>();
    this.subjects[stock] = stockSubject;

    // Subscribe to stock to API
    this.socket?.emit('subscribe', { stock });
    
    return stockSubject.asObservable();
  }
  
  async unsubscribeFromStock(stock: string) {
    this.subjects[stock].complete();
    delete this.subjects[stock];
    
    // Unsubscribe from stock to API
    this.socket?.emit('unsubscribe', { stock });
  }
}
