import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Plan } from '../models/plan';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  private headers: HttpHeaders;
  private siteUrl = environment.apiHost + '/plan';

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
  });
  }

  deletePlan(id): Observable<Plan> {
      return this.http.delete<Plan>(this.siteUrl + "/" + id, { headers: this.headers });
  }

  addPlan(data): Observable<Plan> {
      return this.http.post<Plan>(this.siteUrl, data, { headers: this.headers });
  }

  updatePlan(data): Observable<Plan> {
      return this.http.put<Plan>(this.siteUrl, data, { headers: this.headers });
  }

  getPlanByID(id: string): Observable<Plan> {
      return this.http.get<Plan>(this.siteUrl + '/' + id, { headers: this.headers });
  }

  getAllPlans(): Observable<Plan[]> {
      return this.http.get<Plan[]>(this.siteUrl, { headers: this.headers });
  }
}
