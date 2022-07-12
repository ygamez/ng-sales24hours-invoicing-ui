import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Discount } from '../models/discount';

@Injectable({ providedIn: 'root'})
export class DiscountService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/discount';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<Discount[]>{
		return this.http.get<Discount[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<Discount>{
		return this.http.get<Discount>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: Discount): Observable<Discount> {
		return this.http.post<Discount>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: Discount): Observable<Discount> {
		return this.http.put<Discount>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<Discount> {
		return this.http.delete<Discount>(this.siteUrl + "/" + id, { headers: this.headers });
	}
}
