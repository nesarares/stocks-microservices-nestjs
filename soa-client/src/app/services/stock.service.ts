import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  subjects: { [stock: string]: Subject<number> } = {};

  constructor(private http: HttpClient) {}

  async getAvailableStocks() {
    return this.http.get<{symbol: string, name: string}[]>(`api/stocks`).toPromise();
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

    return stockSubject.asObservable();
  }

  async unsubscribeFromStock(stock: string) {
    this.subjects[stock].complete();
    delete this.subjects[stock];

    // Unsubscribe from stock to API
  }
}
