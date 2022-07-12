import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NbComponentStatus, NbDialogService, NbToastrService } from '@nebular/theme';
import { ApiIntegrationPreference, LegalConsent, Operation, PartnerConfigOverride, PaypalPartnerReferal, RestApiIntegration, ThirdPartyDetails } from 'src/app/models/paypal-partner-referal';
import { StripeAccount } from 'src/app/models/stripe-account';
import { StripeAccountLink } from 'src/app/models/stripe-account-link';
import { AuthService } from 'src/app/service/auth.service';
import { BankAccountService } from 'src/app/service/bankaccount.service';
import { MyStripeService } from 'src/app/service/my-stripe.service';
import { PaypalService } from 'src/app/service/paypal.service';
import { Guid } from "guid-typescript";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-bank-account-connect',
  templateUrl: './bank-account-connect.component.html',
  styleUrls: ['./bank-account-connect.component.scss']
})
export class BankAccountConnectComponent implements OnInit {
  connectingPayPal : boolean;
  connectingStripe: boolean;
  paypalActionUrl: string;
  @ViewChild('dialog', { static: true }) private dialogRef: any;
  cannotConnectStripe: string;
  connotConnectPayPal: string;

  constructor(private myStripeService: MyStripeService,
    private translate: TranslateService,
    private toastrService: NbToastrService,
    private router: Router,
    private bankaccountService : BankAccountService,
    private paypalService: PaypalService,
    private dialogService: NbDialogService,
    private authService: AuthService) { }

  ngOnInit() {
    if (this.router.url === '/dashboard/bank-account/connect/refresh-url'){
      this.createStripeAccount();
    }
    if (this.router.url === '/dashboard/bank-account/connect/return-url' ){
      this.checkIfAccountIsSubmitted();
    }
    this.translate.get('general.cannotConnectStripe').subscribe(res => { this.cannotConnectStripe = res });
    this.translate.get('general.connotConnectPayPal').subscribe(res => { this.connotConnectPayPal = res });
  }

  createStripeAccount(){
    this.connectingStripe = true;
    const user = this.authService.getCurrentUser();
    const account = new StripeAccount();
    account.type = "express";
    account.email = user.email;
    account.userId = this.authService.getCurrentUser().id;
    account.user = this.authService.getCurrentUser();
    return this.myStripeService.createAccount(account).subscribe(
      (result) => {
        if(result != null){
          this.stripeLinkConnect(result);
        }
      },
      error =>{
        console.log(error);
        this.showToast("danger",this.cannotConnectStripe);
      }
    );
  }

  stripeLinkConnect(account: StripeAccount){
    const stripeAccountLink = new StripeAccountLink();
    stripeAccountLink.stripeAccount = account;
    //set refresh url and return url
    //this should recreate the link again and in order to redirect again to stripe;
    stripeAccountLink.refreshUrl = window.location.origin+'/#/dashboard/bank-account/stripe/connect/return-url';
    //this should check if account details is well submitted;
    stripeAccountLink.returnUrl = window.location.origin+'/#/dashboard/bank-account/stripe/connect/return-url';
    //and the type is on boarding
    stripeAccountLink.type = "account_onboarding";
    stripeAccountLink.userId = this.authService.getCurrentUser().id;
    return this.myStripeService.createAccountLink(stripeAccountLink).subscribe(
      (stripeLink) =>{
        if (stripeLink != null){
          location.href = stripeLink.url;
          // window.open(stripeLink.url, "_blank");
        }
      },
      error => {
        this.connectingStripe = false;
        console.log(error);
        this.showToast("danger",this.cannotConnectStripe);
      }
    );
  }

  recreateAccountLink(){
    return this.myStripeService.checkStripeAccount(this.authService.getCurrentUser().tenantId).subscribe(
      (result) =>{
        if (result !=null){
          this.stripeLinkConnect(result);
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  checkIfAccountIsSubmitted(){
    const tenantId = this.authService.getCurrentUser().tenantId;
    return this.myStripeService.checkStripeAccount(tenantId).subscribe(
      (result) =>{
        console.log(result)
        if (result !=null && result.detailsSubmitted){
          this.router.navigateByUrl("dashboard/bank-account-list");
        }else{
          this.router.navigateByUrl("dashboard/bank-account/connect");
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  //Create paypal account
  createPaypalAccount(){
    this.connectingPayPal = true;
    var paypalPartnerReferal = new PaypalPartnerReferal();
    // paypalPartnerReferal.merchantIdInPayPal = "MYDAWYX8NB2B2";//Sandbox id (Replace the live id when going on live)
    paypalPartnerReferal.tracking_id = Guid.create().toString();
    paypalPartnerReferal.email = this.authService.getCurrentUser().email;
    var operation = new Operation();
    operation.operation = "API_INTEGRATION";
    operation.api_integration_preference = new ApiIntegrationPreference();
    operation.api_integration_preference.rest_api_integration = new RestApiIntegration();
    operation.api_integration_preference.rest_api_integration.integration_method = "PAYPAL";
    operation.api_integration_preference.rest_api_integration.integration_type = "THIRD_PARTY";
    operation.api_integration_preference.rest_api_integration.third_party_details = new ThirdPartyDetails();
    operation.api_integration_preference.rest_api_integration.third_party_details.features = [
      "PAYMENT",
      "REFUND"
    ];
    paypalPartnerReferal.operations = [operation];
    paypalPartnerReferal.products =  [
      "EXPRESS_CHECKOUT"
    ];
    var legalConsent = new LegalConsent();
    legalConsent.type = "SHARE_DATA_CONSENT";
    legalConsent.granted = true;
    paypalPartnerReferal.legal_consents = [legalConsent];
    paypalPartnerReferal.partner_config_override = new PartnerConfigOverride();
    //Get logo url and
    paypalPartnerReferal.partner_config_override.return_url = window.location.origin+'/#/dashboard/bank-account/paypal/connect/return-url';
    paypalPartnerReferal.partner_config_override.action_renewal_url = window.location.origin+'/#/dashboard/bank-account/paypal/connect/return-url';
    paypalPartnerReferal.user = this.authService.getCurrentUser();
    return this.paypalService.createAccount(paypalPartnerReferal).subscribe(
      result=>{
        if(result != null){
          this.connectingPayPal = false;
          window.location.href = result.find(x => x.rel ==="action_url").href;
        }
      },
      error => {
        this.connectingPayPal = false;
        console.log(error);
        this.showToast("danger",this.connotConnectPayPal);
      }
    )

  }

  showToast(status: NbComponentStatus, message: string): void {
		this.toastrService.show(status, message, { status, duration:4000 });
	}
}
