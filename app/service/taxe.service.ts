import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Taxe } from '../models/taxe';

@Injectable({ providedIn: 'root'})
export class TaxeService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/taxe';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<Taxe[]>{
		return this.http.get<Taxe[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<Taxe>{
		return this.http.get<Taxe>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: Taxe): Observable<Taxe> {
		return this.http.post<Taxe>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: Taxe): Observable<Taxe> {
		return this.http.put<Taxe>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<Taxe> {
		return this.http.delete<Taxe>(this.siteUrl + "/" + id, { headers: this.headers });
	}
}
