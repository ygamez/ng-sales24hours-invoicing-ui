import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/app/service/auth.service';
import { BankAccountService } from 'src/app/service/bankaccount.service';
import { BankAccount } from 'src/app/models/bankaccount';
import { AddressService } from 'src/app/service/address.service';
import { Address } from 'src/app/models/address';
import { BankType } from 'src/app/models/bank-type';
import { CurrencyService } from 'src/app/service/currency.service';
import { Currency } from 'src/app/models/currency';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'bankaccount-create',
	templateUrl: './bankaccount-create.component.html',
	styleUrls: ['./bankaccount-create.component.scss']
})
export class BankAccountCreateComponent implements OnInit {
	entityForm: FormGroup;
	loading: boolean = false;
	id: string = this.activatedRoute.snapshot.params["id"];
	addresss: Address[] = [];
  type: string;
  stripeAccountId: number;
  editDataLoading: boolean = false;
  currencies: Currency[];
  errorMessage: string;

	constructor( private currencyService: CurrencyService,
		private bankaccountService : BankAccountService,
		private router: Router,
    private translate: TranslateService,
		private _authService: AuthService,
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private addressService: AddressService,
		private toastrService: NbToastrService
	){
		this.entityForm = this.fb.group({
		  bankName: ['',[Validators.required]],
		  bankHolderName: '',
		  accountNumber: '',
		  balance: ['',[Validators.required]],
		  pendingBalance: ['',[Validators.required]],
		  phone:'',
		  currencyId:['',[Validators.required]],
		  address : this.fb.group({
			  addressLine1: '',
			  addressLine2: '',
			  zipCode: '',
			  city: '',
			  country: '',
		  }),
		});
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => { this.errorMessage = res });
	  this.getBankAccount();
    this.getCurrencies();
	}

	save(entity: BankAccount) {
		if (this.entityForm.valid){
		  this.loading = true;
		  entity.createdById = this._authService.getCurrentUser().id;
		  if (this.id != null && this.id !==''){
        entity.stripeAccountId = this.stripeAccountId;
        entity.type = this.type;
        entity.id = +this.id;
        return this.bankaccountService.update(entity)
        .subscribe(() => this.router.navigateByUrl('dashboard/bank-account-list'),
        error => {
            this.loading = false;
            console.log(error);
            this.showToast('danger', this.errorMessage)
        });
		  } else {
        entity.type = BankType.Manual;
        return this.bankaccountService.create(entity)
        .subscribe(() => this.router.navigateByUrl('dashboard/bank-account-list'),
        error => {
            this.loading = false;
            console.log(error);
            this.showToast('danger', this.errorMessage)
        });
		  }
		}
	}

	getBankAccount(){
		if(this.id != null && this.id !== ""){
    this.editDataLoading = true;
		  let id : number = +this.id;
		  return this.bankaccountService.getSingle(id).subscribe(
		    result => {
          if(result.address == null) result.address = new Address();
          this.type = result.type;
          this.stripeAccountId = result.stripeAccountId;
		      this.entityForm.patchValue(result);
          this.editDataLoading = false;
		    }, error => {
          this.editDataLoading = false;
		      console.log(error);
		    }
		  );
		}
	}

  getCurrencies() {
		return this.currencyService.getAll().subscribe( result => {
      this.currencies = result.filter(x => x.userRole === "setting-list");
		}, (error) => {
		  console.log(error);
		});
	}

	showToast(status: NbComponentStatus, message: string): void {
		this.toastrService.show(status, message, { status, duration:4000 });
	}

  controlIsRequired(controlName: string, childControl: string, errorName: string) {
    return ((this.entityForm.controls[controlName]) as FormGroup).controls[childControl].hasError(errorName);
  }
}
