import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChartAccounts } from '../models/chartaccounts';

@Injectable({ providedIn: 'root'})
export class ChartAccountsService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/chartaccounts';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<ChartAccounts[]>{
		return this.http.get<ChartAccounts[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<ChartAccounts>{
		return this.http.get<ChartAccounts>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: ChartAccounts): Observable<ChartAccounts> {
		return this.http.post<ChartAccounts>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: ChartAccounts): Observable<ChartAccounts> {
		return this.http.put<ChartAccounts>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<ChartAccounts> {
		return this.http.delete<ChartAccounts>(this.siteUrl + "/" + id, { headers: this.headers });
	}
}
