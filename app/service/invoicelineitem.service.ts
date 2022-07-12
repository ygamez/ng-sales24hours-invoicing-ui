import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { InvoiceLineItem } from '../models/invoicelineitem';

@Injectable({ providedIn: 'root'})
export class InvoiceLineItemService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/invoicelineitem';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<InvoiceLineItem[]>{
		return this.http.get<InvoiceLineItem[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<InvoiceLineItem>{
		return this.http.get<InvoiceLineItem>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: InvoiceLineItem): Observable<InvoiceLineItem> {
		return this.http.post<InvoiceLineItem>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: InvoiceLineItem): Observable<InvoiceLineItem> {
		return this.http.put<InvoiceLineItem>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<InvoiceLineItem> {
		return this.http.delete<InvoiceLineItem>(this.siteUrl + "/" + id, { headers: this.headers });
	}
}
