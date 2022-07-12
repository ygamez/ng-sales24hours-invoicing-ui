import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product';

@Injectable({ providedIn: 'root'})
export class ProductService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/product';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<Product[]>{
		return this.http.get<Product[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<Product>{
		return this.http.get<Product>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: Product): Observable<Product> {
		return this.http.post<Product>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: Product): Observable<Product> {
		return this.http.put<Product>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<Product> {
		return this.http.delete<Product>(this.siteUrl + "/" + id, { headers: this.headers });
	}
}
