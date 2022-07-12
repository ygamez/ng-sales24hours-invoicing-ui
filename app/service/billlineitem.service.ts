import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BillLineItem } from '../models/billlineitem';

@Injectable({ providedIn: 'root'})
export class BillLineItemService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/billlineitem';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<BillLineItem[]>{
		return this.http.get<BillLineItem[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<BillLineItem>{
		return this.http.get<BillLineItem>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: BillLineItem): Observable<BillLineItem> {
		return this.http.post<BillLineItem>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: BillLineItem): Observable<BillLineItem> {
		return this.http.put<BillLineItem>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<BillLineItem> {
		return this.http.delete<BillLineItem>(this.siteUrl + "/" + id, { headers: this.headers });
	}
}
