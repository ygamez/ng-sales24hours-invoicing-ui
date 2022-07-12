import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Service } from '../models/service';

@Injectable({ providedIn: 'root'})
export class ServiceService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/service';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<Service[]>{
		return this.http.get<Service[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<Service>{
		return this.http.get<Service>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: Service): Observable<Service> {
		return this.http.post<Service>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: Service): Observable<Service> {
		return this.http.put<Service>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<Service> {
		return this.http.delete<Service>(this.siteUrl + "/" + id, { headers: this.headers });
	}
}
