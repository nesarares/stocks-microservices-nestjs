import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_dataviz from '@amcharts/amcharts4/themes/dataviz';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StockService } from 'src/app/services/stock.service';

am4core.useTheme(am4themes_dataviz);

@Component({
  selector: 'app-stock-chart',
  templateUrl: './stock-chart.component.html',
  styleUrls: ['./stock-chart.component.scss'],
})
export class StockChartComponent implements AfterViewInit, OnDestroy {
  @Input() stock: string;
  @Output() remove = new EventEmitter();

  chart: am4charts.XYChart;
  currentPrice: number;
  data: { date: Date; value: number }[];
  chartId: string;

  isLoading = false;
  unsubscribe$ = new Subject();

  constructor(private stockService: StockService) {}

  ngAfterViewInit(): void {
    const chart = am4core.create(this.stock, am4charts.XYChart);
    this.chart = chart;

    // Create axes
    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 60;

    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    const series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = 'value';
    series.dataFields.dateX = 'date';
    series.tooltipText = '{value}';

    series.tooltip.pointerOrientation = 'vertical';

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.snapToSeries = series;
    chart.cursor.xAxis = dateAxis;

    setTimeout(() => {
      this.initData();
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    setTimeout(() => {
      this.chart.dispose();
    }, 1000)
  }

  async initData() {
    try {
      this.isLoading = true;
      const data = await this.stockService.getChartData(this.stock);
      this.data = data;
      this.chart.data = data;
      this.currentPrice = data[data.length - 1]?.value ?? null;

      const stockSubject = await this.stockService.subscribeToStock(this.stock);
      stockSubject
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((currentPrice: number) => {
          this.currentPrice = currentPrice;
          this.data.shift();
          this.data.push({ date: new Date(), value: currentPrice });
          this.chart.data = data;
        });
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }
}
