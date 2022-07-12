import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Address } from '../models/address';

@Injectable({ providedIn: 'root'})
export class AddressService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/address';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<Address[]>{
		return this.http.get<Address[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<Address>{
		return this.http.get<Address>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: Address): Observable<Address> {
		return this.http.post<Address>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: Address): Observable<Address> {
		return this.http.put<Address>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<Address> {
		return this.http.delete<Address>(this.siteUrl + "/" + id, { headers: this.headers });
	}
}
