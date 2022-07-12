import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from '../models/customer';

@Injectable({ providedIn: 'root'})
export class CustomerService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/customer';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<Customer[]>{
		return this.http.get<Customer[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<Customer>{
		return this.http.get<Customer>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: Customer): Observable<Customer> {
		return this.http.post<Customer>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: Customer): Observable<Customer> {
		return this.http.put<Customer>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<Customer> {
		return this.http.delete<Customer>(this.siteUrl + "/" + id, { headers: this.headers });
	}
}
