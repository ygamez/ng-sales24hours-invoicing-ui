import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from '../models/category';

@Injectable({ providedIn: 'root'})
export class CategoryService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/category';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<Category[]>{
		return this.http.get<Category[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<Category>{
		return this.http.get<Category>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: Category): Observable<Category> {
		return this.http.post<Category>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: Category): Observable<Category> {
		return this.http.put<Category>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<Category> {
		return this.http.delete<Category>(this.siteUrl + "/" + id, { headers: this.headers });
	}
}
