import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-stock-select',
  templateUrl: './stock-select.component.html',
  styleUrls: ['./stock-select.component.scss'],
})
export class StockSelectComponent implements OnInit {
  @Input() selected: string[];
  @Output() selectedChange = new EventEmitter();

  all: { symbol: string; name: string }[];

  constructor(private stockService: StockService) {}

  async ngOnInit() {
    this.all = await this.stockService.getAvailableStocks();
  }
}
