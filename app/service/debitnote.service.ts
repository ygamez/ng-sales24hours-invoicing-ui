import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DebitNote } from '../models/debitnote';

@Injectable({ providedIn: 'root'})
export class DebitNoteService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/debitnote';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<DebitNote[]>{
		return this.http.get<DebitNote[]>(this.siteUrl, { headers: this.headers });
	}

  public getAllByBill(billId): Observable<DebitNote[]>{
		return this.http.get<DebitNote[]>(this.siteUrl+'/bill/'+billId, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<DebitNote>{
		return this.http.get<DebitNote>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: DebitNote): Observable<DebitNote> {
		return this.http.post<DebitNote>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: DebitNote): Observable<DebitNote> {
		return this.http.put<DebitNote>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<DebitNote> {
		return this.http.delete<DebitNote>(this.siteUrl + "/" + id, { headers: this.headers });
	}
}
