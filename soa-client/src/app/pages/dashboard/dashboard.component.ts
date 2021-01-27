import { animate, style, transition, trigger } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20%)' }),
        animate('1s ease', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateY(0)' }),
        animate(
          '1s ease',
          style({ opacity: 0, transform: 'translateY(-20%)' })
        ),
      ]),
    ]),
  ],
})
export class DashboardComponent implements OnInit {
  selectedStocks: string[];

  constructor(
    @Inject(DOCUMENT) public document: Document,
    private auth: AuthService,
    private stockService: StockService
  ) {}

  ngOnInit(): void {
    this.selectedStocks = JSON.parse(
      localStorage.getItem('selectedStocks') ?? '["AAPL"]'
    );

    this.stockService.connectSocket();
  }

  logout() {
    localStorage.clear();
    this.auth.logout({ returnTo: document.location.origin });
  }

  removeStock(stock: string) {
    this.selectedStocks = this.selectedStocks.filter((s) => s !== stock);
  }

  save() {
    localStorage.setItem('selectedStocks', JSON.stringify(this.selectedStocks));
  }
}
