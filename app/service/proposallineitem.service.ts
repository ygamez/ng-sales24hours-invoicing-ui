import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProposalLineItem } from '../models/proposallineitem';

@Injectable({ providedIn: 'root'})
export class ProposalLineItemService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/proposallineitem';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<ProposalLineItem[]>{
		return this.http.get<ProposalLineItem[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<ProposalLineItem>{
		return this.http.get<ProposalLineItem>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: ProposalLineItem): Observable<ProposalLineItem> {
		return this.http.post<ProposalLineItem>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: ProposalLineItem): Observable<ProposalLineItem> {
		return this.http.put<ProposalLineItem>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<ProposalLineItem> {
		return this.http.delete<ProposalLineItem>(this.siteUrl + "/" + id, { headers: this.headers });
	}
}
