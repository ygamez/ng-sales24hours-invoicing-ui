import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Company } from '../models/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/company';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<Company[]>{
		return this.http.get<Company[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<Company>{
		return this.http.get<Company>(this.siteUrl + '/' + id, { headers: this.headers });
	}

  public getByTenant(id: number): Observable<Company>{
		return this.http.get<Company>(this.siteUrl + '/tenant/' + id, { headers: this.headers });
	}

	public create(entity: Company): Observable<Company> {
		return this.http.post<Company>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: Company): Observable<Company> {
		return this.http.put<Company>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<Company> {
		return this.http.delete<Company>(this.siteUrl + "/" + id, { headers: this.headers });
	}

}
