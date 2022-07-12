import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreditNote } from '../models/creditnote';

@Injectable({ providedIn: 'root'})
export class CreditNoteService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/creditnote';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<CreditNote[]>{
		return this.http.get<CreditNote[]>(this.siteUrl, { headers: this.headers });
	}

  public getAllByInvoice(invoiceId): Observable<CreditNote[]>{
		return this.http.get<CreditNote[]>(this.siteUrl+'/invoice/'+invoiceId, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<CreditNote>{
		return this.http.get<CreditNote>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: CreditNote): Observable<CreditNote> {
		return this.http.post<CreditNote>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: CreditNote): Observable<CreditNote> {
		return this.http.put<CreditNote>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<CreditNote> {
		return this.http.delete<CreditNote>(this.siteUrl + "/" + id, { headers: this.headers });
	}
}
