import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { SubscriptionService } from '../service/subscription.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionGuard implements CanActivate {

  constructor(private subscriptionService: SubscriptionService,
    private router: Router,
    private authService: AuthService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.subscriptionService.getTenantGuardSubscription(this.authService.getCurrentUser().tenantId, state.url)
      .pipe(
        map(accessGranted => {
          if (accessGranted) return true;
          else{
            this.router.navigateByUrl('/dashboard/setting-list/pricings');
            return false;
          }
        })
      );
  }
}
