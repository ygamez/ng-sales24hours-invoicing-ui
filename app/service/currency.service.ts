import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Currencies } from '../models/currencies';
import { Currency } from '../models/currency';

@Injectable({ providedIn: 'root'})
export class CurrencyService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/currency';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<Currency[]>{
		return this.http.get<Currency[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<Currency>{
		return this.http.get<Currency>(this.siteUrl + '/' + id, { headers: this.headers });
	}

  public getDefault(): Observable<Currency>{
		return this.http.get<Currency>(this.siteUrl + '/default', { headers: this.headers });
	}

	public create(entity: Currency): Observable<Currency> {
		return this.http.post<Currency>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: Currency): Observable<Currency> {
		return this.http.put<Currency>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<Currency> {
		return this.http.delete<Currency>(this.siteUrl + "/" + id, { headers: this.headers });
	}

  public getSuperAdminList(): Observable<Currency[]>{
		return this.http.get<Currency[]>(this.siteUrl+'/all', { headers: this.headers });
	}

}
