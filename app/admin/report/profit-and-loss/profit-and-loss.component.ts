import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbCalendarRange, NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { AccountStatementReport } from 'src/app/models/account-statement-report';
import { DateService } from 'src/app/service/date.service';
import { ReportService } from 'src/app/service/report.service';
import * as html2pdf from 'html2pdf.js';
import { CurrencyService } from 'src/app/service/currency.service';
import { Currency } from 'src/app/models/currency';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-profit-and-loss',
  templateUrl: './profit-and-loss.component.html',
  styleUrls: ['./profit-and-loss.component.scss']
})
export class ProfitAndLossComponent implements OnInit {
  allColumns = [ 'account', 'totalAmount', ];
  reports: AccountStatementReport[] = [];
  grossProfit: number;
  netProfit: number;
  totalIncome: number;
  totalCostOfGoods: number;
  totalOperatingExpense: number;
  range: NbCalendarRange<Date>;
  dateRangePcikerControl: FormControl;
  startAt: string;
  endAt: string;
  loading : boolean = false;
  currency: Currency;

  constructor(private dateService: DateService,
    private currencyService: CurrencyService,
    private reportService: ReportService) {
      var date = new Date();
      var firstDay = new Date(date.getFullYear(), date.getMonth() - 2, 1);
      var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      this.range = {
        start: firstDay,
        end: lastDay,
      };

      this.dateRangePcikerControl = new FormControl(this.range);
      this.startAt =  this.dateService.formatDate(this.range.start);
      this.endAt = this.dateService.formatDate(this.range.end);
  }

  ngOnInit(): void {
    this.getCurrency();
    this.getProfitAndLoss();
  }

  getProfitAndLoss(){
    this.loading = true;
    return this.reportService.getProfitAndLoss(this.startAt, this.endAt).subscribe(
      result => {
        this.reports = result;
        if (this.reports != null && this.reports.length > 0){
          this.totalIncome = this.reports.find(x => x.accountType.name.trim() === 'Income').totalAmount;
          this.totalCostOfGoods = this.reports.find(x => x.accountType.name.trim() === 'Cost of Goods Sold').totalAmount;
          this.totalOperatingExpense = this.reports.find(x => x.accountType.name.trim() === 'Operating Expense').totalAmount;
          this.grossProfit = this.totalIncome - this.totalCostOfGoods;
          this.netProfit = this.grossProfit - this.totalOperatingExpense;
        }
        this.loading = false;
      }, error => {
        console.log(error);
        this.loading = false;

      }
    );
  }

  getDateRange(dateRange){
    this.startAt =  this.dateService.formatDate(dateRange.start);
    this.endAt = this.dateService.formatDate(dateRange.end);
    if (this.startAt != null && this.startAt !== '' && this.endAt != null && this.endAt !== ''){
      this.getProfitAndLoss();
    }
  }

  downloadPdf() {
    let name = "Profit-and-loss-report-"+this.startAt.toString()+"-"+this.endAt.toString();
    var element = document.getElementById('pdfContent');
    // This will implicitly create the canvas and PDF objects before saving.
    var opt = {
      // margin:       1,
      filename: name + '.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  }

  getCurrency(){
    return this.currencyService.getDefault().subscribe(
      result => {
        this.currency = result;
      }, error => {
        console.log(error);
      }
    );
  }

  printPdf(){
    var data = document.getElementById('pdfContent');
    html2canvas(data).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png');
      var div = document.createElement("div");
      var x = document.createElement("IMG");
      x.setAttribute("src", contentDataURL);
      x.setAttribute("alt", "Printable");
      const WindowPrt = window.open();
      div.appendChild(x);
      WindowPrt.document.body.appendChild(div);
      WindowPrt.document.close();
      WindowPrt.focus();
      setTimeout(() => {
        WindowPrt.print();
        WindowPrt.close();
      }, 1500);
    });
  }

}
