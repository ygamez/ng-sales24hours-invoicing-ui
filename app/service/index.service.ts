import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Plan } from '../models/plan';

@Injectable({
  providedIn: 'root'
})
export class IndexService {

	private siteUrl = environment.apiHost + '/dashboard';

  constructor(private http: HttpClient) { }

  getPlans(): Observable<Plan[]> {
    return this.http.get<Plan[]>(this.siteUrl+'/plans');
  }

}
