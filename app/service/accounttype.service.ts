import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountType } from '../models/accounttype';

@Injectable({ providedIn: 'root'})
export class AccountTypeService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/accounttype';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<AccountType[]>{
		return this.http.get<AccountType[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<AccountType>{
		return this.http.get<AccountType>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: AccountType): Observable<AccountType> {
		return this.http.post<AccountType>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: AccountType): Observable<AccountType> {
		return this.http.put<AccountType>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<AccountType> {
		return this.http.delete<AccountType>(this.siteUrl + "/" + id, { headers: this.headers });
	}
}
