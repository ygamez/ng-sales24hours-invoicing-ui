import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/service/auth.service';
import { MyStripeService } from 'src/app/service/my-stripe.service';

@Component({
  selector: 'app-stripe-connect-return',
  templateUrl: './stripe-connect-return.component.html',
  styleUrls: ['./stripe-connect-return.component.scss']
})
export class StripeConnectReturnComponent implements OnInit {
  public message: string;
  public color: string = "";
  public success = false;
  successConnectStripe: string;

  constructor(private myStripeService: MyStripeService,
    private translate: TranslateService,
    private router: Router,
    private toastrService: NbToastrService,
    private authService: AuthService) { }

  ngOnInit() {
    if (this.router.url.startsWith('/dashboard/bank-account/stripe/connect/return-url')){
      this.checkIfAccountIsSubmitted();
    }
    this.translate.get("general.messageStripe").subscribe(res => this.message = res);
    this.translate.get("general.successConnectStripe").subscribe(res => this.successConnectStripe = res);
  }

  checkIfAccountIsSubmitted(){
    const tenantId = this.authService.getCurrentUser().tenantId;
    return this.myStripeService.checkStripeAccount(tenantId).subscribe(
      (result) =>{
        if (result !=null && result.detailsSubmitted){
          this.message = this.successConnectStripe
          this.color = "text-success";
          this.success = true;
          this.showToast('success', this.successConnectStripe)
        }
        else{
          this.router.navigateByUrl("dashboard/bank-account/connect");
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  showToast(status: NbComponentStatus, message: string): void {
		this.toastrService.show(status, message, { status, duration:4000 });
	}

}
