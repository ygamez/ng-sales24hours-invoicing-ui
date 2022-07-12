import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StripeAccount } from '../models/stripe-account';
import { StripeAccountLink } from '../models/stripe-account-link';
import { StripeBalance } from '../models/stripe-balance';
import { StripeSession } from '../models/stripe-session';

@Injectable({
  providedIn: 'root'
})
export class MyStripeService {

	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/stripe';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

  public createAccount(entity: StripeAccount): Observable<StripeAccount> {
		return this.http.post<StripeAccount>(this.siteUrl+'/account', entity, { headers: this.headers });
	}

  public createAccountLink(entity: StripeAccountLink): Observable<StripeAccountLink> {
		return this.http.post<StripeAccountLink>(this.siteUrl+'/account/link', entity, { headers: this.headers });
	}

  public checkStripeAccount(id): Observable<StripeAccount> {
    return this.http.get<StripeAccount>(this.siteUrl + '/tenant/'+id+'/account/check', { headers: this.headers });
  }

  public getStripeAccount(id): Observable<StripeAccount> {
    return this.http.get<StripeAccount>(this.siteUrl + '/tenant/'+id+'/account', { headers: this.headers });
  }

  public getStripeAccountByToken(id, token:string): Observable<StripeAccount> {
    this.headers = new HttpHeaders({"Authorization": "Bearer " + token});
    return this.http.get<StripeAccount>(this.siteUrl + '/tenant/'+id+'/account', { headers: this.headers });
  }

  public getAllStripeAccount(): Observable<any> {
    return this.http.get<any>(this.siteUrl + '/account/all', { headers: this.headers });
  }

  public deleteStripeAccount(accountId): Observable<any> {
		return this.http.delete<any>(this.siteUrl + "/account/" + accountId, { headers: this.headers });
	}

  public createCheckoutSession(entity: StripeSession): Observable<StripeSession> {
	  return this.http.post<StripeSession>(this.siteUrl+'/checkout/session', entity, { headers: this.headers });
  }

  public createCheckoutSessionByToken(entity: StripeSession, token: string): Observable<StripeSession> {
    this.headers = new HttpHeaders({"Authorization": "Bearer " + token});
	  return this.http.post<StripeSession>(this.siteUrl+'/checkout/session', entity, { headers: this.headers });
  }

  public getStripeBalance(id, accountId: number): Observable<StripeBalance> {
    return this.http.get<StripeBalance>(this.siteUrl + '/tenant/'+id+'/account/'+accountId+'/balance', { headers: this.headers });
  }

  public getStripeBalanceTransaction(startDate: string, endDate: string): Observable<StripeBalance> {
    return this.http.get<StripeBalance>(this.siteUrl + '/transaction/get/start/'+startDate+'/end/'+endDate, { headers: this.headers });
  }
}
