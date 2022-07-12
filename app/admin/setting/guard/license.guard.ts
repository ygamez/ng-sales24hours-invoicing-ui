import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SettingType } from 'src/app/models/setting-type';
import { SettingService } from 'src/app/service/setting.service';

@Injectable({
  providedIn: 'root'
})
export class LicenseGuard implements CanActivate {
  licenseType: string;

  constructor(private settingService: SettingService){
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.settingService.getLicense(SettingType.LICENSE).pipe(
      map( accessGranted => {
        return accessGranted;
      })
    )
  }

}
