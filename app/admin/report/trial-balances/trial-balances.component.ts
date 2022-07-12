import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbCalendarRange } from '@nebular/theme';
import { TrialBalanceReport } from 'src/app/models/trial-balance-report';
import { DateService } from 'src/app/service/date.service';
import { ReportService } from 'src/app/service/report.service';
import * as html2pdf from 'html2pdf.js';
import { CurrencyService } from 'src/app/service/currency.service';
import { Currency } from 'src/app/models/currency';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-trial-balances',
  templateUrl: './trial-balances.component.html',
  styleUrls: ['./trial-balances.component.scss']
})
export class TrialBalancesComponent implements OnInit {
  assetsReports: TrialBalanceReport[] = [];
  liabilitiesReports: TrialBalanceReport[] = [];
  equityReports: TrialBalanceReport[] = [];
  incomeReports: TrialBalanceReport[] = [];
  expenseReports: TrialBalanceReport[] = [];
  reports: TrialBalanceReport[];
  dateRangePcikerControl: FormControl;
  date: string;
  totalInvoice: number = 0;
  totalPaidInvoice: number = 0;
  loading: boolean = false;
  currency: Currency;

  constructor(private reportService: ReportService, private dateService: DateService, private currencyService: CurrencyService) {
    var date = new Date();
    this.dateRangePcikerControl = new FormControl(date);
    this.date =  this.dateService.formatDate(date);
  }

  ngOnInit() {
    this.getCurrency();
    this.getTrialBalanceReport();
  }

  getTrialBalanceReport(){
    this.loading = true;
    return this.reportService.getTrialBalanceReport(this.date).subscribe(
      result => {
        if (result != null){
          this.reports = result;
        }
        this.loading = false;
      }, error => {
        console.log(error);
        this.loading = false;
      }
    );
  }

  getDateRange(date){
    this.date =  this.dateService.formatDate(date);
    if (this.date != null && this.date !== ''){
      this.getTrialBalanceReport();
    }
  }

  downloadPdf() {
    let name = "trial-balance-"+this.date.toString();
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
