import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { NbComponentStatus } from '@nebular/theme/components/component-status';
import { TranslateService } from '@ngx-translate/core';
import { PaypalPartnerReferal } from 'src/app/models/paypal-partner-referal';
import { AuthService } from 'src/app/service/auth.service';
import { PaypalService } from 'src/app/service/paypal.service';

@Component({
  selector: 'app-paypal-connect-return',
  templateUrl: './paypal-connect-return.component.html',
  styleUrls: ['./paypal-connect-return.component.scss']
})
export class PaypalConnectReturnComponent implements OnInit {
  private trackingId: string;
  private merchantIdInPayPal: string;
  private permissionsGranted: boolean;
  private accountStatus: string;
  private consentStatus: boolean;
  private productIntentId: string;
  private isEmailConfirmed: boolean;
  private returnMessage: string;
  private riskStatus: string;
  private partnerReferal: PaypalPartnerReferal;
  public message: string;
  public color: string = "";
  public success = false;
  public successConnectPayPal: string;
  occuredError: string;

  constructor(private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private paypalService : PaypalService,
    private toastrService: NbToastrService,
    private router : Router,
    private authService: AuthService) {
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.trackingId = params["merchantId"];
        this.merchantIdInPayPal = params["merchantIdInPayPal"];
        this.permissionsGranted = params["permissionsGranted"];
        this.accountStatus = params["accountStatus"];
        this.productIntentId = params["productIntentId"];
        this.isEmailConfirmed = params["isEmailConfirmed"];
        this.returnMessage = params["returnMessage"];
        this.riskStatus = params["riskStatus"];
        this.consentStatus = params["consentStatus"];
      }
    );

  }

  ngOnInit() {
    if (this.router.url.startsWith('/dashboard/bank-account/paypal/connect/return-url')){
      this.updatePartnerReferal();
    }
    this.translate.get('general.messagePayPal').subscribe(res => { this.message = res });
    this.translate.get('general.successConnectPayPal').subscribe(res => { this.message = res });
    this.translate.get('general.occurredError').subscribe(res => { this.occuredError = res });

  }

  //Get partner referal data in db
  //Update with returned query params data
  //And create paypal bank account in db
  private updatePartnerReferal(){
    var user = this.authService.getCurrentUser();
    var partner = new PaypalPartnerReferal();
    partner.user = user;
    partner.tracking_id = this.trackingId;
    partner.merchantIdInPayPal = this.merchantIdInPayPal;
    partner.permissionsGranted = this.permissionsGranted;
    partner.accountStatus = this.accountStatus;
    partner.consentStatus = this.consentStatus;
    partner.productIntentId = this.productIntentId;
    partner.isEmailConfirmed = this.isEmailConfirmed;
    partner.returnMessage = this.returnMessage;
    partner.riskStatus = this.riskStatus;
    return this.paypalService.updatePartnerReturnData(partner).subscribe(
      result => {
        if (result != null){
          this.message = this.successConnectPayPal;
          this.color = "text-success";
          this.success = true;
          this.showToast('success', this.successConnectPayPal)
        }
      },
      error => {
        console.log(error);
        this.showToast('danger', this.occuredError)
      }
    )
  }

  showToast(status: NbComponentStatus, message: string): void {
		this.toastrService.show(status, message, { status, duration:4000 });
	}
}
