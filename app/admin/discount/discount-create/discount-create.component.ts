import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/app/service/auth.service';
import { DiscountService } from 'src/app/service/discount.service';
import { Discount } from 'src/app/models/discount';
import { Plan } from 'src/app/models/plan';
import { PlanService } from 'src/app/service/plan.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'discount-create',
	templateUrl: './discount-create.component.html',
	styleUrls: ['./discount-create.component.scss']
})
export class DiscountCreateComponent implements OnInit {
	formTitle: string = "Add new discount";
	entityForm: FormGroup;
	loading: boolean = false;
	id: string = this.activatedRoute.snapshot.params["id"];
  plans: Plan[];
  parentRoute: string;
  errorMessage: string;
  deletedItem: string;

	constructor(private translate: TranslateService,
		private discountService : DiscountService,
		private router: Router,
		private _authService: AuthService,
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private toastrService: NbToastrService,
    private planService: PlanService
	){
		this.entityForm = this.fb.group({
		  name: ['',[Validators.required]],
		  planId: ['',[Validators.required]],
		  code: ['',[Validators.required]],
		  value: ['',[Validators.required]],
		  quantity: ['',[Validators.required]],
		});
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentRoute = urlPath[urlPath.length - 1].path;
    });
	  this.getDiscount();
    this.getPlans();
	}

	save(entity: Discount) {
		if (this.entityForm.valid){
		  this.loading = true;
		  entity.createdById = this._authService.getCurrentUser().id;
		  if (this.id != null && this.id !==''){
		      entity.id = +this.id;
		      return this.discountService.update(entity)
		      .subscribe(() => this.router.navigateByUrl(this.parentRoute+'/discounts'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', this.errorMessage)
		      });
		  } else {
		      return this.discountService.create(entity)
		      .subscribe(() => this.router.navigateByUrl(this.parentRoute+'/discounts'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', this.errorMessage)
		      });
		  }
		}
	}

	getDiscount(){
		if(this.id != null && this.id !== ""){
		this.formTitle = "Update discount";
		  let id : number = +this.id;
		  return this.discountService.getSingle(id).subscribe(
		    result => {
		      this.entityForm.patchValue(result);
		    }, error => {
		      console.log(error);
		    }
		  );
		}
	}

	showToast(status: NbComponentStatus, message: string): void {
		this.toastrService.show(status, message, { status, duration:4000 });
	}

  getPlans(){
    return this.planService.getAllPlans().subscribe(
      result => {
        this.plans = result;
      },error => {
        console.log(error)
      }
    );
  }
}
