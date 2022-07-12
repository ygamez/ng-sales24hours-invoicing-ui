import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Role } from '../models/role';

@Injectable({ providedIn: 'root'})
export class RoleService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/roles';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<Role[]>{
		return this.http.get<Role[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<Role>{
		return this.http.get<Role>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: Role): Observable<Role> {
		return this.http.post<Role>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: Role): Observable<Role> {
		return this.http.put<Role>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<Role> {
		return this.http.delete<Role>(this.siteUrl + "/" + id, { headers: this.headers });
	}
}
