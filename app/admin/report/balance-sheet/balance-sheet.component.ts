import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbCalendarRange } from '@nebular/theme';
import { BalanceSheetReport } from 'src/app/models/balance-sheet-report';
import { DateService } from 'src/app/service/date.service';
import { ReportService } from 'src/app/service/report.service';
import * as html2pdf from 'html2pdf.js';
import { CurrencyService } from 'src/app/service/currency.service';
import { Currency } from 'src/app/models/currency';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styleUrls: ['./balance-sheet.component.scss']
})
export class BalanceSheetComponent implements OnInit {
  range: NbCalendarRange<Date>;
  dateRangePcikerControl: FormControl;
  startAt: string;
  endAt: string;
  reports: BalanceSheetReport[];
  loading: boolean = false;
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
    this.getBalanceSheet();
  }

  getBalanceSheet(){
    this.loading = true;
    return this.reportService.getBalanceSheet(this.startAt, this.endAt).subscribe(
      result => {
        this.loading = false;
        this.reports = result;
      }, error => {
        this.loading = false;
        console.log(error);
      }
    )
  }

  getDateRange(dateRange){
    this.startAt =  this.dateService.formatDate(dateRange.start);
    this.endAt = this.dateService.formatDate(dateRange.end);
    if (this.startAt != null && this.startAt !== '' && this.endAt != null && this.endAt !== ''){
      this.getBalanceSheet();
    }
  }

  downloadPdf() {
    let name = "Balance-sheet-"+this.startAt.toString()+"-"+this.endAt.toString();
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
      var x = document.createElement("IMG");
      x.setAttribute("src", contentDataURL);
      x.setAttribute("alt", "Printable");
      const WindowPrt = window.open();
      WindowPrt.document.body.appendChild(x);
      WindowPrt.document.close();
      WindowPrt.focus();
      setTimeout(() => {
        WindowPrt.print();
        WindowPrt.close();
      }, 1000);
    });
  }
}