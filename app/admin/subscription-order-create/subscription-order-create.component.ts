import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { StripeCardComponent, StripeService } from 'ngx-stripe';
import { Plan } from 'src/app/models/plan';
import { StripeSession } from 'src/app/models/stripe-session';
import { Subscription } from 'src/app/models/subscription';
import { AuthService } from 'src/app/service/auth.service';
import { PlanService } from 'src/app/service/plan.service';
import { SubscriptionService } from 'src/app/service/subscription.service';
import { loadStripe } from '@stripe/stripe-js/pure';
import { PaypalSubscription } from 'src/app/models/paypal-subscription';
import { SettingType } from 'src/app/models/setting-type';
import { SettingService } from 'src/app/service/setting.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-subscription-order-create',
  templateUrl: './subscription-order-create.component.html',
  styleUrls: ['./subscription-order-create.component.scss']
})
export class SubscriptionOrderCreateComponent implements OnInit {
  public activeChekoutMethod: string = "stripe";

  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#222b45',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        },

      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      },

    }
  };
  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };
  stripeForm: FormGroup;
  planId: string;
  plan:Plan;
  loading: boolean = false;
  agreementCreatedToken:string;
  disabledBtn: boolean = false;
  stripePublishableKey: string;
  errorMessage: string;

  constructor(private settingService: SettingService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private stripeService: StripeService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _authService: AuthService,
    private _planService: PlanService,
    private _subscriptionService : SubscriptionService,
    private toastrService: NbToastrService) {
      this.planId = this.activatedRoute.snapshot.params['planId'];
    }

  ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.getPlan();
    this.getPaymentSetting();
    this.stripeForm = this.fb.group({
      name: ['', [Validators.required]],
      billingAddress:''
    });
  }

  async checkout(){
    if (this.activeChekoutMethod === "stripe"){
      await this.createStripeSubscription();
    }else if (this.activeChekoutMethod === "paypal"){
      this.createPaypalSubscription();
    }
  }

  async createStripeSubscription(){
    if (this.plan != null && this.stripePublishableKey){
      this.loading = true;
      const stripe = await loadStripe(this.stripePublishableKey);
      const stripeSession = new StripeSession();
      stripeSession.currency = "eur";
      stripeSession.productName = "NgxBook Subscription - "+ this.plan.title;
      stripeSession.quantity = 1;
      stripeSession.successUrl = window.location.origin+"/#/dashboard/subscriptions/checkout-success";
      stripeSession.cancelUrl = window.location.origin+"/#/dashboard/setting-list/pricings";
      stripeSession.planId = this.plan.id;
      stripeSession.plan = this.plan;
      stripeSession.createdById = this._authService.getCurrentUser().id;
      return this._subscriptionService.createCheckoutSession(stripeSession).subscribe(
        result => {
          if (result != null){
            stripe.redirectToCheckout({
              // Make the id field from the Checkout Session creation API response
              // available to this file, so you can provide it as argument here
              // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
              sessionId: result.sessionId
            }).then(function (result) {
              this.loading = false;
              console.log(result.error);
              // If `redirectToCheckout` fails due to a browser or network
              // error, display the localized error message to your customer
              // using `result.error.message`.
            });
          }
        }, error => {

        }
      );
    }
  }

  createPaypalSubscription(){
    if (this.plan != null){
      this.loading = true;
      var subscription =new PaypalSubscription();
      subscription.name = this.plan.title + ' - Paypal subscription';
      subscription.description = this.plan.description;
      subscription.planId = this.plan.id;
      subscription.plan = this.plan;
      subscription.createdById = this._authService.getCurrentUser().id;
      return this._subscriptionService.createPaypalSubscription(subscription).subscribe(
        result => {
          this.loading = false;
          if (result != null)
          {
            if (result.links != null && result.links.length > 0){
              window.location.href = result.links.find(x => x.rel === "approval_url").href;
            }
          }
        },
        error => {
          this.loading = false;
          this.showToast('danger', this.errorMessage)
          console.error(error);
        }
      );
    }
  }

  executePaypalSubscription(paypalSubscription: PaypalSubscription){
    return this._subscriptionService.executePaypalSubscription(paypalSubscription).subscribe(
      () => {
        this.router.navigateByUrl("/subscriptions/success");
      },
      error => {
        console.log(error);
      }
    );
  }

  createSubscription(): void {
    if (this.stripeForm.valid){
      this.loading = true;
      const name = this.stripeForm.get('name').value;
      const billingAddress = this.stripeForm.get('billingAddress').value;
      this.stripeService.createPaymentMethod({
            type: 'card',
            card: this.card.element,
            billing_details: {
              name: name,
              address: billingAddress
            },
          }
        ).subscribe((result) => {
          if (result) {
            var subscription = new Subscription();
            subscription.stripePaymentMethodId = result.paymentMethod.id;
            subscription.planId = +this.planId;
            subscription.userId = this._authService.getCurrentUser().id;
            return this._subscriptionService.addSubscription(subscription).subscribe(
              () => {
                this.loading = false;
                this.router.navigateByUrl('dashboard/setting-list/subscriptions');
              },
              error => {
                this.loading = false;
                this.router.navigateByUrl('dashboard/setting-list/subscriptions');
                console.error(error);
              }
            );
          } else if (result.error) {
            // Error creating the token
            this.loading = false;
          }
        }, error => {
          this.loading = false;
          console.log(error);
        });
    }
  }

  getPlan(){
    return this._planService.getPlanByID(this.planId)
      .subscribe(
        result =>{
          this.plan = result;
          if (this.plan != null && this.plan.price == 0){
            this.activeChekoutMethod == "free";
          }
        },error => {
          console.error(error);
        }
      )
  }

  toggleCheckoutMethod(type:string){
    this.activeChekoutMethod = type;
  }

  showToast(status: NbComponentStatus, message: string) {
	  this.toastrService.show(status, message, { status, duration:4000 });
	}

  getPaymentSetting(){
    return this.settingService.getByType(SettingType.PAYMENT).subscribe(
      result => {
        if (result != null){
          this.stripePublishableKey = result.stripePublishableKey;
        }
      }, error => {
        console.log(error);
      }
    );
	}

}
