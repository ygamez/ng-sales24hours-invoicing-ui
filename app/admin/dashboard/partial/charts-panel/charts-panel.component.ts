import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { takeWhile } from 'rxjs/operators';

import { OrdersChartComponent } from './charts/orders-chart.component';
import { ProfitChartComponent } from './charts/profit-chart.component';
import { OrdersChart } from './model/orders-chart';
import { ProfitChart } from './model/profit-chart';
import { OrderProfitChartSummary, OrdersProfitChartData } from './model/orders-profit-chart';
import { DashboardService } from 'src/app/service/dashboard.service';
import { BarChartReport, LineChartReport, Summary } from 'src/app/models/dashboard-report';

@Component({
  selector: 'charts-panel',
  styleUrls: ['./charts-panel.component.scss'],
  templateUrl: './charts-panel.component.html',
})
export class ChartsPanelComponent implements OnInit, OnDestroy {
  public loading = false;
  private alive = true;
  chartPanelSummary: OrderProfitChartSummary[];
  period: string = 'month';
  ordersChartData: OrdersChart;
  profitChartData: ProfitChart;
  lineChartData: LineChartReport;
  transactionSummury: Summary[];
  activities: BarChartReport;

  @ViewChild('ordersChart', { static: true }) ordersChart: OrdersChartComponent;
  @ViewChild('profitChart', { static: true }) profitChart: ProfitChartComponent;

  constructor(private ordersProfitChartService: OrdersProfitChartData, private dashboardService: DashboardService) {
    // this.ordersProfitChartService.getOrderProfitChartSummary()
    //   .pipe(takeWhile(() => this.alive))
    //   .subscribe((summary) => {
    //     this.chartPanelSummary = summary;
    //   });
    this.getTransactionSummary();
    // this.getOrdersChartData(this.period);
    this.getTransactionsLineChart(this.period);
    this.getActivity(this.period);
    // this.getProfitChartData(this.period);
  }
  ngOnInit(): void {
    // if (this.profitChart) this.profitChart.resizeChart();
    if (this.ordersChart) this.ordersChart.resizeChart();
  }

  setPeriodAndGetChartData(value: string): void {
    if (this.period !== value) {
      this.period = value;
    }
    this.getTransactionsLineChart(value);
    this.getActivity(value);
    // this.getOrdersChartData(value);
    // this.getProfitChartData(value);
  }

  changeTab(selectedTab) {
    if (selectedTab.tabTitle === 'Activities') {
      this.profitChart.resizeChart();
    } else {
      this.ordersChart.resizeChart();
    }
  }

  getOrdersChartData(period: string) {
    this.ordersProfitChartService.getOrdersChartData(period)
      .pipe(takeWhile(() => this.alive))
      .subscribe(ordersChartData => {
        this.ordersChartData = ordersChartData;
      });
  }

  getProfitChartData(period: string) {
    this.ordersProfitChartService.getProfitChartData(period)
      .pipe(takeWhile(() => this.alive))
      .subscribe(profitChartData => {
        this.profitChartData = profitChartData;
      });
  }

  getTransactionsLineChart(period:string){
    this.loading = true;
    return this.dashboardService.getTransactionsLineChart(period)
    .pipe(takeWhile(() => this.alive))
    .subscribe(result =>{
      this.lineChartData = result;
      this.loading = false;
    }, error => {
      console.error(error);
      this.loading = false;
    })
  }

  getTransactionSummary(){
    return this.dashboardService.getTransactionsSummary()
      .pipe(takeWhile(() => this.alive))
      .subscribe( result => {
          this.transactionSummury = result;
        }, error => {
          console.log(error);
        }
      )
  }

  getActivity(report: string){
    this.loading = true;
    return this.dashboardService.getActivity(report)
      .pipe(takeWhile(() => this.alive))
      .subscribe( result => {
          this.activities = result;
          this.loading = false;
        }, error => {
          console.log(error);
          this.loading = false;
        }
      )
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
