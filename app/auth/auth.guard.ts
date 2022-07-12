import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { SettingService } from '../service/setting.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  user: any
  helper: JwtHelperService;
  constructor(private router: Router,
    @Inject(PLATFORM_ID) platformId: Object,
    private authService: AuthService) {
    this.helper = new JwtHelperService();
  }

  canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.user = JSON.parse(localStorage.getItem("user"));
    if (this.user != null && this.user.token != null && !this.helper.isTokenExpired(this.user.token)) {
      let roles = next.data['permittedRoles'] as Array<string>;
      if(this.user.role != null && roles.length > 0 && roles.includes(this.user.role.name)){
        return true;
      }else{
        this.router.navigateByUrl('/dashboard/401-unauthorized');
      }
    }else {
      this.router.navigateByUrl('/auth/sign-in');
      return false;
    }
  }
}
