import { Component, Input, OnInit } from '@angular/core';
import { Currency } from 'src/app/models/currency';
import { CurrencyService } from 'src/app/service/currency.service';

@Component({
  selector: 'ngx-chart-panel-summary',
  styleUrls: ['./chart-panel-summary.component.scss'],
  template: `
    <div class="summary-container">
      <div *ngFor="let item of summary" class="text-primary">
        <div>{{ item.title }}</div>
        <div class="h6 text-primary"><span *ngIf="currency">{{currency.symbol}}</span>{{ item.value.toFixed(2) }}</div>
      </div>
    </div>
  `,
})
export class ChartPanelSummaryComponent implements OnInit {

  @Input() summary: {title: string; value: number}[];
  currency: Currency;

  constructor(private currencyService: CurrencyService){
  }
  ngOnInit(): void {
    this.getDefaultCurrency();
  }

  getDefaultCurrency(){
    return this.currencyService.getDefault().subscribe(
      result => {
        this.currency = result;
      },error => {
        console.log(error);
      }
    )
  }
}

