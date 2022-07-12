import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BankAccount } from '../models/bankaccount';

@Injectable({ providedIn: 'root'})
export class BankAccountService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/bankaccount';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<BankAccount[]>{
		return this.http.get<BankAccount[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<BankAccount>{
		return this.http.get<BankAccount>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: BankAccount): Observable<BankAccount> {
		return this.http.post<BankAccount>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: BankAccount): Observable<BankAccount> {
		return this.http.put<BankAccount>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<BankAccount> {
		return this.http.delete<BankAccount>(this.siteUrl + "/" + id, { headers: this.headers });
	}
}
