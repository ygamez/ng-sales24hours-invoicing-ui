import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountTypeCategory } from '../models/accounttypecategory';

@Injectable({ providedIn: 'root'})
export class AccountTypeCategoryService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/accounttypecategory';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<AccountTypeCategory[]>{
		return this.http.get<AccountTypeCategory[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<AccountTypeCategory>{
		return this.http.get<AccountTypeCategory>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: AccountTypeCategory): Observable<AccountTypeCategory> {
		return this.http.post<AccountTypeCategory>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: AccountTypeCategory): Observable<AccountTypeCategory> {
		return this.http.put<AccountTypeCategory>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<AccountTypeCategory> {
		return this.http.delete<AccountTypeCategory>(this.siteUrl + "/" + id, { headers: this.headers });
	}
}
