import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/app/service/auth.service';
import { ChartAccountsService } from 'src/app/service/chartaccounts.service';
import { ChartAccounts } from 'src/app/models/chartaccounts';
import { AccountTypeService } from 'src/app/service/accounttype.service';
import { AccountType } from 'src/app/models/accounttype';
import { AccountTypeCategory } from 'src/app/models/accounttypecategory';
import { AccountTypeCategoryService } from 'src/app/service/accounttypecategory.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'chartaccounts-create',
	templateUrl: './chartaccounts-create.component.html',
	styleUrls: ['./chartaccounts-create.component.scss']
})
export class ChartAccountsCreateComponent implements OnInit {
	entityForm: FormGroup;
	loading: boolean = false;
	id: string = this.activatedRoute.snapshot.params["id"];
	public accounttypes: AccountType[] = [];
  public accountTypesCategoryzed: IAccountTypeCategory[] = [];
  errorMessage: string;
  deletedItem: string;


	constructor(private chartaccountsService : ChartAccountsService,
		private router: Router,
    private translate: TranslateService,
		private _authService: AuthService,
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private accounttypeService: AccountTypeService,
		private toastrService: NbToastrService,){
		this.entityForm = this.fb.group({
		  accountTypeId : ['',[Validators.required]],
		  accountId: ['',[Validators.required]],
		  accountName: ['',[Validators.required]],
		  currency: '',
		  description: '',
		});
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => { this.deletedItem = res });
	  this.getChartAccounts();
		this.getAccountType();
	}

	save(entity: ChartAccounts) {
		if (this.entityForm.valid){
		  this.loading = true;
		  this.loading = true;
		  entity.createdById = this._authService.getCurrentUser().id;
		  if (this.id != null && this.id !==''){
		      entity.id = +this.id;
		      return this.chartaccountsService.update(entity)
		      .subscribe(() => this.router.navigateByUrl('/dashboard/chart-accounts-list'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', this.errorMessage)
		      });
		  } else {
		      return this.chartaccountsService.create(entity)
		      .subscribe(() => this.router.navigateByUrl('/dashboard/chart-accounts-list'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', this.errorMessage);
		      });
		  }
		}
	}

	getChartAccounts(){
		if(this.id != null && this.id !== ""){
		  let id : number = +this.id;
		  return this.chartaccountsService.getSingle(id).subscribe(
		    result => {
		      this.entityForm.patchValue(result);
		    }, error => {
		      console.log(error);
		    }
		  );
		}
	}

	getAccountType(){
	  return this.accounttypeService.getAll().subscribe( result => {
	    this.accounttypes = result;
      if (result != null){
        this.accountTypesCategoryzed = [];
        this.accountTypesCategoryzed.push(
          {
            category: "Assets",
            accountTypes: result.filter(x => x.accountTypeCategory.name === "Assets")
          },
          {
            category: "Liabilities & Credit Cards",
            accountTypes: result.filter(x => x.accountTypeCategory.name === "Liabilities & Credit Cards")
          },
          {
            category: "Income",
            accountTypes: result.filter(x => x.accountTypeCategory.name === "Income")
          },
          {
            category: "Expenses",
            accountTypes: result.filter(x => x.accountTypeCategory.name === "Expenses")
          },
          {
            category: "Equity",
            accountTypes: result.filter(x => x.accountTypeCategory.name === "Equity")
          },
        )
      }
	  }, error => {
	    console.log(error);
	  });
	}

	showToast(status: NbComponentStatus, message: string): void {
		this.toastrService.show(status, message, { status, duration:4000 });
	}
}

interface IAccountTypeCategory{
  category: string;
  accountTypes: AccountType[];
}
