import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaypalSubscription } from 'src/app/models/paypal-subscription';
import { SubscriptionService } from 'src/app/service/subscription.service';

@Component({
  selector: 'app-successful-subscription',
  templateUrl: './successful-subscription.component.html',
  styleUrls: ['./successful-subscription.component.scss']
})
export class SuccessfulSubscriptionComponent implements OnInit {
  agreementCreatedToken: string;
  loading: boolean = false;
  constructor(private activatedRoute: ActivatedRoute, private subscriptionService: SubscriptionService) { }

  ngOnInit() {
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.agreementCreatedToken = params["token"];
      }
    );

    if (this.agreementCreatedToken != null && this.agreementCreatedToken !== ''){
      var paypalSub = new PaypalSubscription();
      paypalSub.token = this.agreementCreatedToken;
      this.executePaypalSubscription(paypalSub);
    }
  }

  executePaypalSubscription(paypalSubscription: PaypalSubscription){
    this.loading = true;
    return this.subscriptionService.executePaypalSubscription(paypalSubscription).subscribe(
      () => {
        this.loading = false;
      },
      error => {
        this.loading = false;
        console.log(error);
      }
    );
  }

}
