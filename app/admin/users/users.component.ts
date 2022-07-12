import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbDialogService, NbMenuService, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'src/app/models/subscription';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/auth.service';
import { SubscriptionService } from 'src/app/service/subscription.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[];
  successMessage: string;
  errorMessage: string;
  loading = false;
  message: string;
  parentRoute: string;
  public subscription: Subscription;
  public subscriptionPercentLimit: number;
  public totalUser: number;
  items = [
    { title: 'Assign a plan' }
  ];
  userRole = this.authService.getCurrentUser().role.name;
  occurredError:string;
  deletedItem: string;
  userDeleteConfirm: string;
  invitationSent: string;

  constructor( private toastrService: NbToastrService,
    private translate: TranslateService,
    private _userService: UserService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private subscriptionService: SubscriptionService,
    private router: Router,
    private menuService: NbMenuService,
    private dialogService: NbDialogService) { }

  ngOnInit() {
    this.translate.get('general.occurredError').subscribe(res => this.occurredError = res);
    this.translate.get('general.userDeleteConfirm').subscribe(res => this.userDeleteConfirm = res);
    this.translate.get('general.invitationSent').subscribe(res => this.invitationSent = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);

    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentRoute = urlPath[urlPath.length - 1].path;
    });
    if (this.authService.userIsSuperAdmin() && this.parentRoute === 'super-admin-console'){
      this.getSuperAdminUsers();
    }else{
      this.getUsers();
    }
    this.getSubscription();

  }

  getUsers() {
    this.loading = true;
    return this._userService.getUsers().subscribe(
      result => {
        this.totalUser = result?.length;
        this.users = result;
        this.loading = false;
      },
      error => {
        console.log(error);
        this.loading = false;
        this.errorMessage = this.errorMessage;
      }
    );
  }

  getSuperAdminUsers() {
    this.loading = true;
    return this._userService.getSuperAdminUsers().subscribe(
      result => {
        this.users = result;
        this.loading = false;
      },
      error => {
        console.log(error);
        this.loading = false;
        this.errorMessage = this.occurredError;
      }
    );
  }

  deleteUser(id: number) {
    return this._userService.delete(id).subscribe(
      result => {
        if (this.authService.userIsSuperAdmin() && this.parentRoute === 'super-admin-console'){
          this.getSuperAdminUsers();
        }else{
          this.getUsers();
        }
        this.showToast("success", this.deletedItem,0);
      },
      error => {
        console.log(error);
        this.showToast("danger", this.occurredError,0);
      }
    )
  }

  open(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, { context: this.userDeleteConfirm })
    .onClose.subscribe(id => id && this.deleteUser(id));;
  }

  showToast(status: NbComponentStatus, message: string, duration: number) {
	  this.toastrService.show(status, message, { status, duration:duration });
	}

  sendRecoveryLink(user: User){
    user.currentUrl = window.location.origin;
    this.authService.sendRecoveryLink(user).subscribe(
      (result) => {
        this.showToast("success", this.invitationSent,0);
        if (this.authService.userIsSuperAdmin() && this.parentRoute === 'super-admin-console'){
          this.getSuperAdminUsers();
        }else{
          this.getUsers();
        }
      },
      error => {
        this.showToast("success", this.occurredError,0)
        console.log(error);
      }
    )
  }

  getSubscription(){
    return this.subscriptionService.getTenantSubscription(this.authService.getCurrentUser().tenantId).subscribe(
      (result) => {
        this.subscription = result;
        if(result != null && result.plan){
          this.subscriptionPercentLimit = (this.totalUser / result.plan.maxUser) * 100;
        }
        if (result.plan.maxUser <= -1){
          this.subscriptionPercentLimit = 0;
        }else{
          this.subscriptionPercentLimit = (this.totalUser / result.plan.maxUser) * 100;
        }
      }
    );
  }

  redirectToUserCreateComponent(){
    if (this.router.url == "/dashboard/setting-list/users"){
      this.router.navigateByUrl('/dashboard/setting-list/users/create');
    }
    else{
      this.router.navigateByUrl('/dashboard/super-admin-console/users/create');
    }
  }

}
