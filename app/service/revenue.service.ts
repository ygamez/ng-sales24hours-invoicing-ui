import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Revenue } from '../models/revenue';

@Injectable({ providedIn: 'root'})
export class RevenueService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/revenue';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<Revenue[]>{
		return this.http.get<Revenue[]>(this.siteUrl, { headers: this.headers });
	}

  public getAllByInvoice(invoiceId: number): Observable<Revenue[]>{
		return this.http.get<Revenue[]>(this.siteUrl+'/invoice/'+invoiceId, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<Revenue>{
		return this.http.get<Revenue>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: Revenue): Observable<Revenue> {
		return this.http.post<Revenue>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: Revenue): Observable<Revenue> {
		return this.http.put<Revenue>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<Revenue> {
		return this.http.delete<Revenue>(this.siteUrl + "/" + id, { headers: this.headers });
	}

  public getTotalIcome(): Observable<number>{
    return this.http.get<number>(this.siteUrl+'/total', { headers: this.headers });
  }

}
