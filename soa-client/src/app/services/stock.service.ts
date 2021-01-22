import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  subjects: { [stock: string]: Subject<number> } = {};

  constructor() {}

  async getAvailableStocks() {
    return ['AAPL', 'DPZ', 'TWLO'];
  }

  async getChartData(stock: string): Promise<{ date: Date; value: number }[]> {
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve(null);
      }, 2000)
    );

    const data = [];
    let value = 50;
    for (var i = 0; i < 300; i++) {
      const date = new Date(new Date().getTime() - i * 5 * 1000);
      value -= Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
      data.push({ date: date, value: value });
    }
    return data.reverse();
  }

  async subscribeToStock(stock: string) {
    if (this.subjects[stock]) {
      return this.subjects[stock].asObservable();
    }

    const stockSubject = new Subject<number>();
    this.subjects[stock] = stockSubject;

    let interval = setInterval(() => {
      if (!this.subjects[stock]) {
        clearInterval(interval);
        return;
      }

      stockSubject.next(Math.round(Math.random() * 200));
    }, 5000);

    return stockSubject.asObservable();
  }

  async unsubscribeFromStock(stock: string) {
    this.subjects[stock].complete();
    delete this.subjects[stock];
  }
}
