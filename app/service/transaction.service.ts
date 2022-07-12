import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Transaction } from '../models/transaction';

@Injectable({ providedIn: 'root'})
export class TransactionService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/transaction';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<Transaction[]>{
		return this.http.get<Transaction[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<Transaction>{
		return this.http.get<Transaction>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: Transaction): Observable<Transaction> {
		return this.http.post<Transaction>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: Transaction): Observable<Transaction> {
		return this.http.put<Transaction>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<Transaction> {
		return this.http.delete<Transaction>(this.siteUrl + "/" + id, { headers: this.headers });
	}
}
