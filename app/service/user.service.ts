import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiHost + '/users';
  private header: HttpHeaders;

  constructor(private _http: HttpClient) {
    this.header = new HttpHeaders(
      {
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
      });
  }

  create(user: User): Observable<User> {
    return this._http.post<User>(this.apiUrl, user, { headers: this.header })
  }

  update(user: User): Observable<User> {
    return this._http.put<User>(this.apiUrl, user, { headers: this.header });
  }

  updateProfile(user: User): Observable<User> {
    return this._http.put<User>(this.apiUrl+"/profile", user, { headers: this.header });
  }

  delete(id: number) {
    return this._http.delete(this.apiUrl + '/' + id, { headers: this.header });
  }

  get(id: string): Observable<User> {
    return this._http.get<User>(this.apiUrl + '/' + id, { headers: this.header });
  }

  getUsers(): Observable<User[]> {
    return this._http.get<User[]>(this.apiUrl, { headers: this.header });
  }

  getSuperAdminUsers(): Observable<User[]> {
    return this._http.get<User[]>(this.apiUrl+'/all', { headers: this.header });
  }
}
