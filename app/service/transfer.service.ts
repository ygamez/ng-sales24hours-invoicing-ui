import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Transfer } from '../models/transfer';

@Injectable({ providedIn: 'root'})
export class TransferService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/transfer';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<Transfer[]>{
		return this.http.get<Transfer[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<Transfer>{
		return this.http.get<Transfer>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: Transfer): Observable<Transfer> {
		return this.http.post<Transfer>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: Transfer): Observable<Transfer> {
		return this.http.put<Transfer>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<Transfer> {
		return this.http.delete<Transfer>(this.siteUrl + "/" + id, { headers: this.headers });
	}
}
