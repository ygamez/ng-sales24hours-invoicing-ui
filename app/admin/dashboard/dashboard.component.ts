import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountStatementReport } from 'src/app/models/account-statement-report';
import { AccountTransactionReport } from 'src/app/models/account-transaction-report';
import { Bill } from 'src/app/models/bill';
import { Currency } from 'src/app/models/currency';
import { CardReport } from 'src/app/models/dashboard-report';
import { Goal } from 'src/app/models/goal';
import { Invoice } from 'src/app/models/invoice';
import { Proposal } from 'src/app/models/proposal';
import { Transaction } from 'src/app/models/transaction';
import { CurrencyService } from 'src/app/service/currency.service';
import { DashboardService } from 'src/app/service/dashboard.service';
import { InvoiceService } from 'src/app/service/invoice.service';
import { ReportService } from 'src/app/service/report.service';
import { RevenueService } from 'src/app/service/revenue.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  invoices: Invoice[];
  estimates: Proposal[];
  transactions: Transaction[];
  goals: Goal[];
  bills: Bill[];
  invoiceCard: CardReport;
  customerCard: CardReport;
  estimateCard: CardReport;
  balanceCard: CardReport;
  cardReportLoading: boolean = false;
  accountStatementReports: AccountStatementReport[];
  accountTransactionReports: AccountTransactionReport[];
  invoiceCardLoading: boolean = false;
  estimateCardLoading: boolean = false;
  billCardLoading: boolean = false;
  transactionLoading: boolean = false;
  currency: Currency;
  totalBalance: string = "0.0";
  pendindBalance: string = "0.0";
  totalInvoice: string = "0";
  monthlyInvoice: string = "0";
  totalCustomer: string = "0";
  monthlyCustomer: string = "0";
  totalEstimate: string = "0";
  monthlyEstimate: string = "0";
  totalIcome: number= 0;

  constructor(private dashboardService: DashboardService, private currencyService: CurrencyService, private revenueService: RevenueService) {}

  ngOnInit(): void {
    this.getCardReport();
    this.getLastInvoices();
    this.getLastEstimates();
    this.getLastBills();
    this.getLastTransactions();
    this.getDefaultCurrency();
    this.getLastGoals();
  }

  getCardReport(){
    this.cardReportLoading = true;
    return this.dashboardService.getCardReports().subscribe(
      result => {
        if (result != null){

          // Invoice report
          this.invoiceCard = result.find(x => x.category === "Invoice");
          if (this.invoiceCard != null){
            this.totalInvoice = this.invoiceCard.total.toString();
            if (this.invoiceCard.total >= 1000) {
              this.totalInvoice = (this.invoiceCard.total / 1000).toFixed(2) + "K";
            }
            if (this.invoiceCard.total >= 1000000) {
              this.totalInvoice= (this.invoiceCard.total / 1000000).toFixed(2) + "M";
            }
            if (this.invoiceCard.total >= 1000000000) {
              this.totalInvoice = (this.invoiceCard.total / 1000000000).toFixed(2) + "B";
            }

            this.monthlyInvoice = this.invoiceCard.monthTotal.toString();
            if (this.invoiceCard.monthTotal >= 1000) {
              this.monthlyInvoice = (this.invoiceCard.monthTotal / 1000).toFixed(2) + "K";
            }
            if (this.invoiceCard.monthTotal >= 1000000) {
              this.monthlyInvoice = (this.invoiceCard.monthTotal / 1000000).toFixed(2) + "M";
            }
            if (this.invoiceCard.total >= 1000000000) {
              this.monthlyInvoice = (this.invoiceCard.monthTotal / 1000000000).toFixed(2) + "B";
            }
          }

          // Balance
          this.balanceCard = result.find(x => x.category === "Balance");
          if (this.balanceCard != null){
            this.totalBalance = this.balanceCard.total.toString();
            if (this.balanceCard.total >= 1000) {
              this.totalBalance = (this.balanceCard.total / 1000).toFixed(2) + "K";
            }
            if (this.balanceCard.total >= 1000000) {
              this.totalBalance = (this.balanceCard.total / 1000000).toFixed(2) + "M";
            }
            if (this.balanceCard.total >= 1000000000) {
              this.totalBalance= (this.balanceCard.total / 1000000000).toFixed(2) + "B";
            }
            if (this.balanceCard.total >= 1000000000000) {
              this.totalBalance= (this.balanceCard.total / 1000000000000).toFixed(2) + "T";
            }

            this.pendindBalance = this.balanceCard.monthTotal.toString();
            if (this.balanceCard.monthTotal >= 1000) {
              this.pendindBalance = (this.balanceCard.monthTotal / 1000).toFixed(2) + "K";
            }
            if (this.balanceCard.monthTotal >= 1000000) {
              this.pendindBalance = (this.balanceCard.monthTotal / 1000000).toFixed(2) + "M";
            }
            if (this.balanceCard.total >= 1000000000) {
              this.pendindBalance = (this.balanceCard.monthTotal / 1000000000).toFixed(2) + "B";
            }
            if (this.balanceCard.total >= 1000000000000) {
              this.pendindBalance = (this.balanceCard.monthTotal / 1000000000000).toFixed(2) + "T";
            }
          }

          //Customer
          this.customerCard = result.find(x => x.category === "Customer");
          if (this.customerCard != null){
            this.totalCustomer = this.customerCard.total.toString();
            if (this.customerCard.total >= 1000) {
              this.totalCustomer = (this.customerCard.total / 1000).toFixed(2) + "K";
            }
            if (this.customerCard.total >= 1000000) {
              this.totalCustomer = (this.customerCard.total / 1000000).toFixed(2) + "M";
            }
            if (this.customerCard.total >= 1000000000) {
              this.totalCustomer = (this.customerCard.total / 1000000000).toFixed(2) + "B";
            }

            this.monthlyCustomer = this.customerCard.monthTotal.toString();
            if (this.customerCard.monthTotal >= 1000) {
              this.monthlyCustomer = (this.customerCard.monthTotal / 1000).toFixed(2) + "K";
            }
            if (this.customerCard.monthTotal >= 1000000) {
              this.monthlyCustomer = (this.customerCard.monthTotal / 1000000).toFixed(2) + "M";
            }
            if (this.customerCard.monthTotal >= 1000000000) {
              this.monthlyCustomer = (this.customerCard.monthTotal / 1000000000).toFixed(2) + "B";
            }

          }

          //Estimate
          this.estimateCard = result.find(x => x.category === "Proposal");
          if (this.estimateCard != null){
            this.totalEstimate = this.estimateCard.total.toString();
            if (this.estimateCard.total >= 1000) {
              this.totalEstimate = (this.estimateCard.total / 1000).toFixed(2) + "K";
            }
            if (this.estimateCard.total >= 1000000) {
              this.totalEstimate = (this.estimateCard.total / 1000000).toFixed(2) + "M";
            }
            if (this.estimateCard.total >= 1000000000) {
              this.totalEstimate = (this.estimateCard.total / 1000000000).toFixed(2) + "B";
            }

            this.monthlyEstimate = this.estimateCard.monthTotal.toString();
            if (this.estimateCard.monthTotal >= 1000) {
              this.monthlyEstimate = (this.estimateCard.monthTotal / 1000).toFixed(2) + "K";
            }
            if (this.estimateCard.monthTotal >= 1000000) {
              this.monthlyEstimate = (this.estimateCard.monthTotal / 1000000).toFixed(2) + "M";
            }
            if (this.estimateCard.monthTotal >= 1000000000) {
              this.monthlyEstimate = (this.estimateCard.monthTotal / 1000000000).toFixed(2) + "B";
            }
          }

          this.cardReportLoading = false;
        }
      }, error => {
        console.log(error);
        this.cardReportLoading = false;

      }
    )
  }

  getLastInvoices() {
    this.invoiceCardLoading = true;
		return this.dashboardService.getLastInvoices().subscribe( result => {
      if (result != null){
        result.forEach(x => {
          x.dueDateIsPassed = false;
          if (new Date(x.issueDate) < new Date()){
            x.dueDateIsPassed = true;
          }
        });
        this.invoices = result;
        this.invoiceCardLoading = false;
      }
		}, (error) => {
      this.invoiceCardLoading = false;
		  console.log(error);
		});
	}

  getLastEstimates() {
    this.estimateCardLoading = true;
		return this.dashboardService.getLastEstimates().subscribe( result => {
      if (result != null){
        result.forEach(x => {
          x.dueDateIsPassed = false;
          if (new Date(x.issueDate) < new Date()){
            x.dueDateIsPassed = true;
          }
        });
        this.estimateCardLoading = false;
        this.estimates = result;
      }
		}, (error) => {
      this.estimateCardLoading = false;
      console.log(error);
		});
	}

  getLastBills() {
    this.billCardLoading = true;
		return this.dashboardService.getLastBills().subscribe( result => {
      if (result != null){
        result.forEach(x => {
          x.dueDateIsPassed = false;
          if (new Date(x.issueDate) < new Date()){
            x.dueDateIsPassed = true;
          }
        });
        this.billCardLoading = false;
        this.bills = result;
      }
		}, (error) => {
      this.billCardLoading = false;
      console.log(error);
		});
	}


  getLastGoals() {
    return this.revenueService.getTotalIcome().subscribe(incomes => {
		  this.totalIcome = incomes;
      this.dashboardService.getLastGoals().subscribe( result => {
        this.goals = result;
        for(let item of result){
          item.value = 0;
          if (this.totalIcome != null && this.totalIcome > 0){
            item.value = (this.totalIcome * 100) / item.amount;
            if (item.value > 100) item.value = 100;
          }
          if (item.value <= 25){
            item.status = "danger";
          }else if (item.value <= 50){
            item.status = "warning";
          }else if (item.value <= 75){
            item.status = "primary"
          }else if(item.value <= 100){
            item.status = "success";
          }
        }
      }, (error) => {
        console.log(error);
      });
		}, (error) => {
		  console.log(error);
		});

	}

  getLastTransactions() {
    this.transactionLoading = true;
		return this.dashboardService.getLastTransactions().subscribe( result => {
      if (result != null){
        this.transactionLoading = false;
        this.transactions = result;
      }
		}, (error) => {
      this.transactionLoading = false;
      console.log(error);
		});
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
