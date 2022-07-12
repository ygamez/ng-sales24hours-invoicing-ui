import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrdersChart } from '../admin/dashboard/partial/charts-panel/model/orders-chart';
import { AccountBalanceReport } from '../models/account-balance-report';
import { AccountStatementReport } from '../models/account-statement-report';
import { AccountTransactionReport } from '../models/account-transaction-report';
import { BalanceSheetReport } from '../models/balance-sheet-report';
import { CustomerReport } from '../models/customer-report';
import { Revenue } from '../models/revenue';
import { TaxReport } from '../models/tax-report';
import { TrialBalanceReport } from '../models/trial-balance-report';
import { VendorReport } from '../models/vendor-report';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/report';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

  public getProfitAndLoss(startAt: string,endAt: string): Observable<AccountStatementReport[]>{
    return this.http.get<AccountStatementReport[]>(this.siteUrl+'/profit-and-loss/start-at/'+startAt+'/end-at/'+endAt, { headers: this.headers });
  }

  public getBalanceSheet(startAt: string,endAt: string): Observable<BalanceSheetReport[]>{
    return this.http.get<BalanceSheetReport[]>(this.siteUrl+'/balance-sheet/start-at/'+startAt+'/end-at/'+endAt, { headers: this.headers });
  }

  public getTaxReport(startAt: string,endAt: string): Observable<TaxReport[]>{
    return this.http.get<TaxReport[]>(this.siteUrl+'/tax/start-at/'+startAt+'/end-at/'+endAt, { headers: this.headers });
  }

  public getCustomerReport(startAt: string,endAt: string): Observable<CustomerReport[]>{
    return this.http.get<CustomerReport[]>(this.siteUrl+'/customer/start-at/'+startAt+'/end-at/'+endAt, { headers: this.headers });
  }

  public getVendorReport(startAt: string,endAt: string): Observable<VendorReport[]>{
    return this.http.get<VendorReport[]>(this.siteUrl+'/vendor/start-at/'+startAt+'/end-at/'+endAt, { headers: this.headers });
  }

  public getAccountBalanceReport(startAt: string,endAt: string): Observable<AccountBalanceReport[]>{
    return this.http.get<AccountBalanceReport[]>(this.siteUrl+'/account-balance/start-at/'+startAt+'/end-at/'+endAt, { headers: this.headers });
  }

  public getTrialBalanceReport(date: string): Observable<TrialBalanceReport[]>{
    return this.http.get<TrialBalanceReport[]>(this.siteUrl+'/trial-balance/date/'+date, { headers: this.headers });
  }

  public getAccountTransactionReport(startAt: string,endAt: string): Observable<AccountTransactionReport[]>{
    return this.http.get<AccountTransactionReport[]>(this.siteUrl+'/account-transaction/start-at/'+startAt+'/end-at/'+endAt, { headers: this.headers });
  }


}
