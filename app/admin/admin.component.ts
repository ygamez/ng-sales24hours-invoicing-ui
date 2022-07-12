import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SettingType } from '../models/setting-type';
import { Subscription } from '../models/subscription';
import { AuthService } from '../service/auth.service';
import { BankAccountService } from '../service/bankaccount.service';
import { SettingService } from '../service/setting.service';
import { SubscriptionService } from '../service/subscription.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  subscription: Subscription;
  hasStripeConnected: boolean = false;
  hasPayPalConnected: boolean = false;
  grantLKAccess: boolean = false;

  constructor(private subscriptionService: SubscriptionService,
    private bankaccountService: BankAccountService,
    private authService: AuthService,
    private titleService: Title,
    private settingService: SettingService,
    private router: Router) {
    }

  ngOnInit(): void {
    this.getSubscription();
    this.checkConnectedBank();
    this.getLkSetting();
  }

  //Get the subscription
  // If one the plan option reach 75% show upgrade subscription alert
  // If the plan is trial show message to upgrade and the remaining days for the trial plan
  getSubscription(){
    return this.subscriptionService.getTenantSubscription(this.authService.getCurrentUser().tenantId).subscribe(
      (result) => {
        this.subscription = result;
        // localStorage.setItem('subscription', JSON.stringify(result));
      }
    );
  }

  checkConnectedBank() {
		return this.bankaccountService.getAll().subscribe( result => {
      if (result != null){
        this.hasStripeConnected =  result.find(x => x.type === "Stripe") != null;
        this.hasPayPalConnected =  result.find(x => x.type === "PayPal") != null;
      }
		}, (error) => {
		  console.log(error);
		});
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
}
