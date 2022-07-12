import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Currency } from 'src/app/models/currency';
import { Plan } from 'src/app/models/plan';
import { AuthService } from 'src/app/service/auth.service';
import { CurrencyService } from 'src/app/service/currency.service';
import { PlanService } from 'src/app/service/plan.service';

@Component({
  selector: 'app-pricing-create',
  templateUrl: './pricing-create.component.html',
  styleUrls: ['./pricing-create.component.scss']
})
export class PricingCreateComponent implements OnInit {
  planForm: FormGroup;
  loading: boolean = false;
  errorMessage : string;
  currencies: Currency[];
  parentRoute: string;
  public planId: string = 'plan'; // this.activatedRoute.snapshot.params["id"];
  private originUrl: string;
  private createdAt: Date;
  private updatedAt: Date;
  private createdById: number;
  public selectedCurrency: number;
  public currencyId: number;
  private stripePriceId:string;
  private stripeProductId: string;
  private paypalPlanId: string;
  public statuses: string [] = [
    "Visible",
    "Hidden",
  ];
  private cannotDelete: boolean = false;
  private occurredError: string;
  private deletedItem: string;
  private demoMode: string;

  constructor(private _planService: PlanService,
    private activatedRoute: ActivatedRoute,
    private toastrService: NbToastrService,
    private currencyService: CurrencyService,
    private _fb: FormBuilder,
    private router: Router,
    private translate: TranslateService,
    private _auth: AuthService) {
    this.planForm = this._fb.group({
        title: ['', [Validators.required]],
        description: '',
        price: ['',Validators.required],
        currencyId: ['',Validators.required],
        maxProduct:  ['',Validators.required],
        maxCustomer: ['',Validators.required],
        maxOrder:  ['',Validators.required],
        maxEstimate: ['',Validators.required],
        maxUser:  ['',Validators.required],
        recommended: true,
        state: ['Visible',Validators.required]
      });
      this.activatedRoute.parent.url.subscribe((urlPath) => {
        this.parentRoute = urlPath[urlPath.length - 1].path;
      });
   }

  ngOnInit() {
    this.translate.get('general.occurredError').subscribe(res => this.occurredError = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
    this.translate.get('general.demoMode').subscribe(res => this.demoMode = res);
    this.getCurrencies();
    if (this.planId != null && this.planId != ""){
      this.getPlan(this.planId);
    }
  }

  create(plan){
    this.planForm.valid;
    plan.originUrl = window.location.origin;
    if (this.planForm.valid){
      this.loading = true;
      var userId = this._auth.getCurrentUser().id;
      plan.createdById = userId;
      if (this.planId != null && this.planId != ""){
        plan.id = +this.planId;
        plan.createdAt = this.createdAt;
        plan.updatedAt = this.updatedAt;
        plan.createdById = this.createdById;
        plan.originUrl = this.originUrl;
        plan.currencyId = this.currencyId;
        plan.paypalPlanId = this.paypalPlanId;
        plan.stripePriceId = this.stripePriceId;
        plan.stripeProductId = this.stripeProductId;
        plan.cannotDelete = this.cannotDelete;
        return this._planService.updatePlan(plan).subscribe(
          () => {
            this.loading = false;
            this.router.navigateByUrl('/dashboard/'+this.parentRoute+'/pricings');
          },
          error => {
            this.showToast("danger",  this.occurredError);
            console.error(error);
            this.loading = false;
          }
        );
      }
      else{
        return this._planService.addPlan(plan).subscribe(
          () => {
            this.loading = false;
            this.router.navigateByUrl('/dashboard/'+this.parentRoute+'/pricings');
          },
          error => {
            this.showToast("danger", this.occurredError);
            console.error(error);
            this.loading = false;
          }
        );
      }

    }
  }

  restrict(){
    this.showToast('warning', this.demoMode);
  }

  getCurrencies(){
    return this.currencyService.getAll().subscribe(
      result => {
        if (result != null && result.length > 0){
          this.currencies = result.filter(x => x.userRole === "super-admin-console");
          this.selectedCurrency = result[0].id;
        }
      },error => {
        console.log(error);
      }
    )
  }

  getPlan(id: string){
    return this._planService.getPlanByID(id)
      .subscribe(
        (result) => {
          if(result != null){
            this.stripeProductId = result.stripeProductId;
            this.stripePriceId = result.stripePriceId;
            this.paypalPlanId = result.paypalPlanId;
            this.currencyId = result.currencyId;
            this.originUrl = result.originUrl;
            this.updatedAt = result.updatedAt;
            this.createdAt = result.createdAt;
            this.createdById = result.createdById;
            this.cannotDelete = result.cannotDelete;
            this.planForm.patchValue(result);
          }
        },error => {
          console.error(error);
        }
      );
  }


  showToast(status: NbComponentStatus, message: string) {
	  this.toastrService.show(status, message, { status, duration:4000 });
	}
}
