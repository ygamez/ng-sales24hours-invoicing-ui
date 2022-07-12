import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Assets } from '../models/assets';

@Injectable({ providedIn: 'root'})
export class AssetsService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/assets';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<Assets[]>{
		return this.http.get<Assets[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<Assets>{
		return this.http.get<Assets>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: Assets): Observable<Assets> {
		return this.http.post<Assets>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: Assets): Observable<Assets> {
		return this.http.put<Assets>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<Assets> {
		return this.http.delete<Assets>(this.siteUrl + "/" + id, { headers: this.headers });
	}
}
