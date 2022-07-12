import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbDialogService, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { PaypalSubscription } from 'src/app/models/paypal-subscription';
import { Plan } from 'src/app/models/plan';
import { SettingType } from 'src/app/models/setting-type';
import { Subscription } from 'src/app/models/subscription';
import { AuthService } from 'src/app/service/auth.service';
import { PlanService } from 'src/app/service/plan.service';
import { SettingService } from 'src/app/service/setting.service';
import { SubscriptionService } from 'src/app/service/subscription.service';
import { SubscriptionOrderCreateComponent } from '../subscription-order-create/subscription-order-create.component';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {
  userIsSuperAdmin: boolean = this._authService.userIsSuperAdmin();
  plans: Plan[];
  successMessage: string;
  errorMessage: string;
  subscription: Subscription;
  loading: boolean;
  status = 'basic';
  parentRoute: string;
  deleteLoading:boolean;
  plan: Plan;
  role: string = this._authService.getCurrentUser().role.name;
  userId: string = this.activatedRoute.snapshot.params["userId"];
  public grantLKAccess: boolean = false;
  occurredError: string;
  deletedItem: string;
  planDeleted: string;
  planDeleteConfirmation: string;

  constructor(private toastrService: NbToastrService,
    private translate: TranslateService,
    private _planService: PlanService,
    private _authService:AuthService,
    private dialogService: NbDialogService,
    private _subscriptionService: SubscriptionService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private settingService: SettingService
  ) { }

  ngOnInit() {
    this.translate.get('general.occurredError').subscribe(res => this.occurredError = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
    this.translate.get('general.planDeleted').subscribe(res => this.planDeleted = res);
    this.translate.get('general.planDeleteConfirmation').subscribe(res => this.planDeleteConfirmation = res);
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentRoute = urlPath[urlPath.length - 1].path;
    });
    this.getSubscription();
    this.getLkSetting();
  }

  choosePlan(planId){
    this.loading = true;
    this._subscriptionService.getTenantSubscription(this._authService.getCurrentUser().tenantId).subscribe(
      (result) => {
        console.log(result)
        if (result != null){
          if (result.paypalAgreementId != null && result.paypalAgreementId !==  ''){
            this.plan = this.plans.find(x => x.id == planId);
            var data = new PaypalSubscription();
            data.paypalId = result.paypalAgreementId;
            data.name = this.plan.title + ' - Paypal subscription update';
            data.description = this.plan.description;
            data.planId = planId;
            data.plan = this.plan;
            data.createdById = this._authService.getCurrentUser().id;
            return this._subscriptionService.updatePayPalSubscription(data).subscribe(
              result => {
                this.loading = false;
                if (result != null){
                  if (result.links != null && result.links.length > 0){
                    window.location.href = result.links.find(x => x.rel === "approval_url").href;
                  }
                }
              },error => {
                this.loading = false;
                this.showToast('danger', this.occurredError)
                console.error(error);
              }
            );
          }

          if (result.plan.price <= 0 || result.active == false){
            this.router.navigateByUrl('dashboard/setting-list/plan/'+planId+'/order');
          }else if (result.plan.price > 0 && result.active == true){
            var subscription = new Subscription();
            subscription.planId = planId;
            subscription.plan = null;
            subscription.active = true;
            subscription.stripeCustomerId =  result.stripeCustomerId;
            subscription.stripePaymentMethodId =  result.stripePaymentMethodId;
            subscription.stripePlanId =  result.stripePlanId;
            subscription.stripeSubId =  result.stripeSubId;
            subscription.userId =  result.userId;
            subscription.currentPeriodEnd =  result.currentPeriodEnd;
            subscription.currentPeriodStart =  result.currentPeriodStart;
            subscription.subscriptionPortalUrl = result.subscriptionPortalUrl;
            subscription.renew = true;
            subscription.userId = this._authService.getCurrentUser().id;
            return this._subscriptionService.upgradeSubscription(subscription).subscribe(
              () => {
                window.location.href = '/dashboard/subscriptions/checkout-success';
              }, error => {
                console.log(error);
                this.loading = false;
              }
            );
          }
        }else{
          this.router.navigateByUrl('dashboard/setting-list/plan/'+planId+'/order')
        }
      }
    );
  }

  orderPlan(planId){
    this.loading = true;
    this.plan = this.plans.find(x => x.id == planId);
    return this._subscriptionService.getAllSubscriptions(this._authService.getCurrentUser().id)
      .subscribe(
        (result) => {
          // If there is no subscription or active subscripton is canceled
          if ( this.plan.price > 0
            && ( result.length == 0
            || result.find(x => x.paid) == null
            || (result.find(x => x.plan.price == 0 && x.active) != null && result.filter(x => x.plan.price > 0).length == 0)
            || result.filter(x => x.canceledAt != null).length > 0
            || result.find(x => x.active) == null)){
            this.router.navigateByUrl('dashboard/setting-list/plan/'+planId+'/order')
          }else{
            var subscription = new Subscription();
            subscription.planId = planId;
            subscription.plan = null;
            subscription.active = true;

            if(result.length > 0){
              subscription.stripeCustomerId =  result[0].stripeCustomerId;
              subscription.stripePaymentMethodId =  result[0].stripePaymentMethodId;
              subscription.stripePlanId =  result[0].stripePlanId;
              subscription.stripeSubId =  result[0].stripeSubId;
              subscription.userId =  result[0].userId;
              subscription.currentPeriodEnd =  result[0].currentPeriodEnd;
              subscription.currentPeriodStart =  result[0].currentPeriodStart;
            }else{
              subscription.userId = this._authService.getCurrentUser().id;
            }
            subscription.createdAt =  new Date();
            result.push(subscription);
            this._subscriptionService.updateSubscriptionList(result).subscribe(
              () => {
                this.loading = false;
                window.location.href = 'dashboard/setting-list/subscriptions';
              }, error => {console.log(error); this.loading = false;}
            );
          }
        },error => {
          this.loading = false;
          console.error(error);
        }
      );
  }

  assign(planId){
    this.loading = true;
    this.plan = this.plans.find(x => x.id == planId);
    if (this.userId != null && this.userId != ''){
      return this._subscriptionService.getTenantSubscription(this._authService.getCurrentUser().tenantId).subscribe(
        (result) => {

          if (result.paypalAgreementId != null && result.paypalAgreementId !==  ''){
            this.plan = this.plans.find(x => x.id == planId);
            var data = new PaypalSubscription();
            data.paypalId = result.paypalAgreementId;
            data.name = this.plan.title + ' - Paypal subscription update';
            data.description = this.plan.description;
            data.planId = planId;
            data.plan = this.plan;
            data.createdById = this._authService.getCurrentUser().id;
            return this._subscriptionService.updatePayPalSubscription(data).subscribe(
              result => {
                this.loading = false;
                if (result != null){
                  if (result.links != null && result.links.length > 0){
                    window.location.href = result.links.find(x => x.rel === "approval_url").href;
                  }
                }
              },error => {
                this.loading = false;
                this.showToast('danger', this.occurredError)
                console.error(error);
              }
            );
          }

          var subscription = new Subscription();
          subscription.planId = planId;
          subscription.plan = null;
          subscription.active = true;
          subscription.stripeCustomerId =  result?.stripeCustomerId;
          subscription.stripePaymentMethodId =  result?.stripePaymentMethodId;
          subscription.stripePlanId =  result?.stripePlanId;
          subscription.stripeSubId =  result?.stripeSubId;
          subscription.stripeSubId =  result?.stripeSubId;
          subscription.paypalAgreementId =  result?.paypalAgreementId;
          subscription.userId =  this._authService.getCurrentUser().id;
          subscription.subscriptionPortalUrl = result?.subscriptionPortalUrl;
          subscription.renew = true;
          subscription.userId = this._authService.getCurrentUser().id;
          this._subscriptionService.upgradeSubscription(subscription).subscribe(
            () => {
              window.location.href = 'dashboard/super-admin-console/users'
            }, error => {
              console.log(error);
              this.showToast('danger', this.occurredError);
              this.loading = false;
            }
          );
        }
      );
    }
  }

  updateSubscription(subscription: Subscription){
    this._subscriptionService.updateSubscription(subscription)
      .subscribe(
        () => {
          window.location.href = '/setting-list/subscriptions'
        },error =>{
          console.error(error);
        }
      )
  }

  getSubscription(){
    return this._subscriptionService.getAllSubscriptions(this._authService.getCurrentUser().id)
      .subscribe(
        (result) => {
          if(result != null && result.length > 0){
            this.subscription = result.find(x => x.active == true);
          }
          this.getAllPlans();
        },error => {
          console.error(error);
        }
      );
  }

  getLkSetting(){
    return this.settingService.getByType(SettingType.LICENSE).subscribe(
      result => {
        if (result != null){
          this.grantLKAccess = result.licenseType === "e5b467c4-4a0f-435d-a889-c7b14033f671";
        }
      }, error => {
        console.log(error);
      }
    );
	}

  getAllPlans() {
    this._planService.getAllPlans().subscribe(plans => {
      if (this.role === "SuperAdmin"){
        this.plans = plans;
      }else{
        this.plans = plans.filter(x => x.state === "Visible");
      }
      if (this.plans != null){
        this.plans.forEach(p => {
          p.cardStatus = 'primary'
          if (this.subscription != null && this.subscription.planId == p.id){
            p.cardStatus = 'success';
          }
        });
      }
    }, (error) => {console.log(error)});
  }

  delete(id){
    this.deleteLoading = true;
    return this._planService.deletePlan(id).subscribe(
      () => {
        this.deleteLoading = false;
        this.getSubscription();
        this.showToast('success', this.planDeleted);
      },
      error => {
        this.deleteLoading = false;
        console.log(error);
        this.showToast('danger', this.occurredError)
      }
    )
  }

  open(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, { context: this.planDeleteConfirmation })
    .onClose.subscribe(id => id && this.delete(id));;
  }

  redirectCheckout(planId){
    this.router.navigateByUrl('/dashboard/checkout/'+planId);
  }

  showToast(status: NbComponentStatus, message: string) {
	  this.toastrService.show(status, message, { status, duration:4000 });
	}

}
