import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrdersChart } from './orders-chart';
import { ProfitChart } from './profit-chart';

export interface OrderProfitChartSummary {
  title: string;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersProfitChartData {
  getOrderProfitChartSummary(): Observable<OrderProfitChartSummary[]> {
    let summary: OrderProfitChartSummary[] =
    [
      {
        title: "Total incomes",
        value: 2000
      },
      {
        title: "Profit",
        value: 2025
      },
      {
        title: "Sales",
        value: 2075
      },
      {
        title: "Sales",
        value: 2075
      },
    ]
    var result = new Observable<OrderProfitChartSummary[]>(sub => {
      sub.next(summary)
    })
    return result;
  }

  getOrdersChartData(period: string): Observable<OrdersChart> {
    let order: OrdersChart = {
      chartLabel: ["Jan", "fev", "mars", "avril", "mai", "juin"],
      linesData: [[50, 80, 20, 50,50,50], [10, 25, 50, 50, 50, 50], [20, 25, 80, 50, 50, 50]]
    }
    var result = new Observable<OrdersChart>(sub => {
      sub.next(order)
    })
    return result;
  }

  getProfitChartData(period: string): Observable<ProfitChart> {
    let profit: ProfitChart = {
      chartLabel: ["order1", "order2", "order3"],
      data: [[50, 80, 20], [10, 25, 50], [20, 25, 80]]
    }
    var result = new Observable<ProfitChart>(sub => {
      sub.next(profit)
    })
    return result;
  }
}
