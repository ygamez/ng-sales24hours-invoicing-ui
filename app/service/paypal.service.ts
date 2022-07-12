import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Invoice } from '../models/invoice';
import { PaypalPartnerReferal } from '../models/paypal-partner-referal';

@Injectable({
  providedIn: 'root'
})
export class PaypalService {

	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/paypal';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

  public createAccount(entity: PaypalPartnerReferal): Observable<any> {
    return this.http.post<any>(this.siteUrl+'/account', entity, { headers: this.headers });
  }

  public getPartnerReferalByTenant(id: number): Observable<PaypalPartnerReferal> {
    return this.http.get<PaypalPartnerReferal>(this.siteUrl+'/account/tenant/'+id, { headers: this.headers })
  }

  public updatePartnerReferal(entity: PaypalPartnerReferal): Observable<PaypalPartnerReferal> {
		return this.http.put<PaypalPartnerReferal>(this.siteUrl+'/account', entity, { headers: this.headers });
	}

  public updatePartnerReturnData(entity: PaypalPartnerReferal): Observable<PaypalPartnerReferal> {
		return this.http.put<PaypalPartnerReferal>(this.siteUrl+'/account/onboarding/return', entity, { headers: this.headers });
	}

  public checkoutCompleted(entity: PaypalPartnerReferal): Observable<Invoice> {
    return this.http.post<Invoice>(this.siteUrl+'/invoice/{invoiceId}/checkout/completed', entity, { headers: this.headers });
  }

}
