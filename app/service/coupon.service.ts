import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Coupon } from '../models/coupon';

@Injectable({ providedIn: 'root'})
export class CouponService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/coupon';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<Coupon[]>{
		return this.http.get<Coupon[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<Coupon>{
		return this.http.get<Coupon>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: Coupon): Observable<Coupon> {
		return this.http.post<Coupon>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: Coupon): Observable<Coupon> {
		return this.http.put<Coupon>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<Coupon> {
		return this.http.delete<Coupon>(this.siteUrl + "/" + id, { headers: this.headers });
	}
}
