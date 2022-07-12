import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Bill } from '../models/bill';
import { BarChartReport, CardReport, LineChartReport, PieChartReport, Summary } from '../models/dashboard-report';
import { Goal } from '../models/goal';
import { Invoice } from '../models/invoice';
import { Plan } from '../models/plan';
import { Proposal } from '../models/proposal';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/dashboard';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getCardReports(): Observable<CardReport[]>{
		return this.http.get<CardReport[]>(this.siteUrl+"/card-reports", { headers: this.headers });
	}

  public getLastInvoices(): Observable<Invoice[]>{
		return this.http.get<Invoice[]>(this.siteUrl+'/invoices/last', { headers: this.headers });
	}

  public getLastEstimates(): Observable<Proposal[]>{
		return this.http.get<Proposal[]>(this.siteUrl+'/estimates/last', { headers: this.headers });
	}

  public getLastBills(): Observable<Bill[]>{
		return this.http.get<Bill[]>(this.siteUrl+'/bills/last', { headers: this.headers });
	}

  public getLastGoals(): Observable<Goal[]>{
		return this.http.get<Goal[]>(this.siteUrl+'/goals/last', { headers: this.headers });
	}

  public getLastTransactions(): Observable<Transaction[]>{
		return this.http.get<Transaction[]>(this.siteUrl+'/transactions/last', { headers: this.headers });
	}

  getPlans(): Observable<Plan[]> {
    return this.http.get<Plan[]>(this.siteUrl+'/plans', { headers: this.headers });
  }

  getTransactionsLineChart(period: string): Observable<LineChartReport> {
    return this.http.get<LineChartReport>(this.siteUrl+'/transactions/period/'+period, { headers: this.headers });
  }

  getTransactionsSummary(): Observable<Summary[]> {
    return this.http.get<Summary[]>(this.siteUrl+'/transactions/summary', { headers: this.headers });
  }

  getActivity(period: string): Observable<BarChartReport> {
    return this.http.get<BarChartReport>(this.siteUrl+'/activity/period/'+period, { headers: this.headers });
  }

  getPieChartReport(): Observable<any[]> {
    return this.http.get<any[]>(this.siteUrl+'/invoice/report', { headers: this.headers });
  }

}
