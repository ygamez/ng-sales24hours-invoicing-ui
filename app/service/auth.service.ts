import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { RoleEnum } from '../models/role-enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiHost + '/auth';
  headers: HttpHeaders;
  helper: JwtHelperService;

  constructor(private http: HttpClient, private router: Router) {
      this.helper = new JwtHelperService();
   }

  signUp(user): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  signIn(user): Observable<User> {
    return this.http.post<User>(this.apiUrl+'/sign-in', user);
  }

  socialSignIn(user): Observable<User> {
    return this.http.post<User>(this.apiUrl+'/social/sign-in', user);
  }

  logout(){
    //this.getCurrentUser().token = null;
    localStorage.removeItem("user");
    this.router.navigateByUrl('/');
    window.location.reload();
    // this.socialSignOut();
  }

  // socialSignOut(): void {
  //   this.socialAuthService.signOut();
  // }

  sendRecoveryLink(user:User): Observable<User> {
    return this.http.post<User>(this.apiUrl+ '/send-recovery-link', user);
  }

  checkRecoveryEmailToken(token:string){
    return this.helper.isTokenExpired(token)
  }

  getCurrentUser(): User{
    return JSON.parse(localStorage.getItem('user'));
  }

  userIsAuthenticated(){
    return this.getCurrentUser() != null;
  }

  updatePassword(user : User, token): Observable<User> {
    this.headers = new HttpHeaders(
    {
      'Authorization': 'Bearer ' + token
    });
    return this.http.put<User>(this.apiUrl + '/reset-password', user, { headers: this.headers });
  }

  getSettingToken(): Observable<any> {
    return this.http.get<any>(this.apiUrl+'/setting/token');
  }

  userIsSuperAdmin(): boolean{
    if(this.getCurrentUser() != null && this.getCurrentUser().role != null){
      return this.getCurrentUser().role.name == RoleEnum.SuperAdmin;
    }
    return false;
  }

  userIsAdmin(): boolean{
    if(this.getCurrentUser() != null && this.getCurrentUser().role != null){
      return this.getCurrentUser().role.name == RoleEnum.Admin;
    }
    return false;
  }

  userIsSuperUser(): boolean{
    if(this.getCurrentUser() != null && this.getCurrentUser().role != null){
      return this.getCurrentUser().role.name == RoleEnum.SuperUser;
    }
    return false;
  }

  userIsUser(): boolean{
    if(this.getCurrentUser() != null && this.getCurrentUser().role != null){
      return this.getCurrentUser().role.name == RoleEnum.User;
    }
    return false;
  }

  userIsViewer(): boolean{
    if(this.getCurrentUser() != null && this.getCurrentUser().role != null){
      return this.getCurrentUser().role.name == RoleEnum.Viewer;
    }
    return false;
  }

}
