import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ManualJournalLineItem } from '../models/manualjournallineitem';

@Injectable({ providedIn: 'root'})
export class ManualJournalLineItemService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/manualjournallineitem';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<ManualJournalLineItem[]>{
		return this.http.get<ManualJournalLineItem[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<ManualJournalLineItem>{
		return this.http.get<ManualJournalLineItem>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: ManualJournalLineItem): Observable<ManualJournalLineItem> {
		return this.http.post<ManualJournalLineItem>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: ManualJournalLineItem): Observable<ManualJournalLineItem> {
		return this.http.put<ManualJournalLineItem>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<ManualJournalLineItem> {
		return this.http.delete<ManualJournalLineItem>(this.siteUrl + "/" + id, { headers: this.headers });
	}
}
