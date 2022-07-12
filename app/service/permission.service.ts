import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Permission } from '../models/permission';

@Injectable({ providedIn: 'root'})
export class PermissionService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/permission';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<Permission[]>{
		return this.http.get<Permission[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<Permission>{
		return this.http.get<Permission>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: Permission): Observable<Permission> {
		return this.http.post<Permission>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: Permission): Observable<Permission> {
		return this.http.put<Permission>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<Permission> {
		return this.http.delete<Permission>(this.siteUrl + "/" + id, { headers: this.headers });
	}
}
