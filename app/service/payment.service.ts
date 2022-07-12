import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Payment } from '../models/payment';

@Injectable({ providedIn: 'root'})
export class PaymentService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/payment';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<Payment[]>{
		return this.http.get<Payment[]>(this.siteUrl, { headers: this.headers });
	}

  public getAllByBill(billId: number): Observable<Payment[]>{
		return this.http.get<Payment[]>(this.siteUrl+'/bill/'+billId, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<Payment>{
		return this.http.get<Payment>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: Payment): Observable<Payment> {
		return this.http.post<Payment>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: Payment): Observable<Payment> {
		return this.http.put<Payment>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<Payment> {
		return this.http.delete<Payment>(this.siteUrl + "/" + id, { headers: this.headers });
	}
}
