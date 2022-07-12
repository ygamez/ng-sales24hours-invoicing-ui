import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Vendor } from '../models/vendor';

@Injectable({ providedIn: 'root'})
export class VendorService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/vendor';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<Vendor[]>{
		return this.http.get<Vendor[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<Vendor>{
		return this.http.get<Vendor>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: Vendor): Observable<Vendor> {
		return this.http.post<Vendor>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: Vendor): Observable<Vendor> {
		return this.http.put<Vendor>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<Vendor> {
		return this.http.delete<Vendor>(this.siteUrl + "/" + id, { headers: this.headers });
	}
}
