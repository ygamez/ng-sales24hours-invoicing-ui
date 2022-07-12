import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Goal } from '../models/goal';

@Injectable({ providedIn: 'root'})
export class GoalService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/goal';

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<Goal[]>{
		return this.http.get<Goal[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<Goal>{
		return this.http.get<Goal>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: Goal): Observable<Goal> {
		return this.http.post<Goal>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: Goal): Observable<Goal> {
		return this.http.put<Goal>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<Goal> {
		return this.http.delete<Goal>(this.siteUrl + "/" + id, { headers: this.headers });
	}
}
