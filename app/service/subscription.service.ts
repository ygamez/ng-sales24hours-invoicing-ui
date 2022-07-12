import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PaypalSubscription } from '../models/paypal-subscription';
import { StripeSession } from '../models/stripe-session';
import { Subscription } from '../models/subscription';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private siteUrl = environment.apiHost + '/Subscriptions';
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user'))?.token
    });
  }

  deleteSubscription(id): Observable<Subscription> {
      return this.http.delete<Subscription>(this.siteUrl + "/" + id, { headers: this.headers });
  }

  addSubscription(data): Observable<Subscription> {
    return this.http.post<Subscription>(this.siteUrl, data, { headers: this.headers });
  }

  upgradeSubscription(data: Subscription){
    return this.http.post<Subscription>(this.siteUrl+'/v2/create', data, { headers: this.headers });
  }

  createCheckoutSession(data): Observable<StripeSession> {
    return this.http.post<StripeSession>(this.siteUrl+"/stripe/checkout/session", data, { headers: this.headers });
  }

  createPaypalSubscription(data: PaypalSubscription): Observable<PaypalSubscription> {
    return this.http.post<PaypalSubscription>(this.siteUrl+"/paypal/create", data, { headers: this.headers });
  }

  executePaypalSubscription(data: PaypalSubscription): Observable<PaypalSubscription> {
    return this.http.post<PaypalSubscription>(this.siteUrl+"/paypal/execute", data, { headers: this.headers });
  }

  updatePayPalSubscription(data: PaypalSubscription): Observable<PaypalSubscription> {
    return this.http.put<PaypalSubscription>(this.siteUrl+"/paypal/update", data, { headers: this.headers });
  }

  addSubscriptionLine(data): Observable<Subscription> {
    return this.http.post<Subscription>(this.siteUrl+'/new-line', data, { headers: this.headers });
  }

  updateSubscription(data): Observable<Subscription> {
      return this.http.put<Subscription>(this.siteUrl, data, { headers: this.headers });
  }

  updateSubscriptionList(data): Observable<Subscription[]> {
    return this.http.put<Subscription[]>(this.siteUrl+'/update-range', data, { headers: this.headers });
}

  getSubscriptionByID(id): Observable<Subscription> {
      return this.http.get<Subscription>(this.siteUrl + '/' + id, { headers: this.headers });
  }

  getUserSubscription(userId): Observable<Subscription> {
    return this.http.get<Subscription>(this.siteUrl + '/user/' + userId, { headers: this.headers });
  }

  getTenantSubscription(tenantId): Observable<Subscription> {
    return this.http.get<Subscription>(this.siteUrl + '/tenant/' + tenantId, { headers: this.headers });
  }

  getTenantGuardSubscription(tenantId,url:string): Observable<boolean> {
    return this.http.get<Subscription>(this.siteUrl + '/tenant/' + tenantId, { headers: this.headers }).pipe(
      map(sub => {
        if (sub != null){
          if (sub.plan.price <= 0) sub.renew = true;
          if (sub != null && sub.renew){
            if (sub.canCreateInvoice && url === '/dashboard/invoice/create'){
              return true;
            }
            if (sub.canCreateEstimate && url === '/dashboard/proposal/create'){
              return true;
            }
            if (sub.canCreateCustomer && url === '/dashboard/customer/create'){
              return true;
            }
            if (sub.canCreateProduct && url === '/dashboard/product/create'){
              return true;
            }
            if (sub.canCreateProduct && url === '/dashboard/service/create'){
              return true;
            }
            if (sub.canCreateUser && url === '/dashboard/setting-list/users/create'){
              return true;
            }
          }
          return false;
        }
      })
    );
  }

  getAllSubscriptions(userId: number): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(this.siteUrl+'/all/user/'+userId, { headers: this.headers });
  }

  cancelSubscription(data): Observable<Subscription> {
    return this.http.put<Subscription>(this.siteUrl+'/cancel', data, { headers: this.headers });
  }

  getSuperAdminSubscriptions(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(this.siteUrl+'/all', { headers: this.headers });
  }
}
