import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/app/service/auth.service';
import { TransferService } from 'src/app/service/transfer.service';
import { Transfer } from 'src/app/models/transfer';
import { BankAccountService } from 'src/app/service/bankaccount.service';
import { BankAccount } from 'src/app/models/bankaccount';

@Component({
	selector: 'transfer-create',
	templateUrl: './transfer-create.component.html',
	styleUrls: ['./transfer-create.component.scss']
})
export class TransferCreateComponent implements OnInit {
	formTitle: string = "Add new transfer";
	entityForm: FormGroup;
	loading: boolean = false;
	id: string = this.activatedRoute.snapshot.params["id"];
	public bankaccounts: BankAccount[] = [];

	constructor(
		private transferService : TransferService,
		private router: Router,
		private _authService: AuthService,
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private bankaccountService: BankAccountService,
		private toastrService: NbToastrService
	){
		this.entityForm = this.fb.group({
		  fromBankAccountId: ['',[Validators.required]],
		  toBankAccount: ['',[Validators.required]],
		  amount: ['',[Validators.required]],
		  date: ['',[Validators.required]],
		  reference: ['',[Validators.required]],
		  description: ['',[Validators.required]],
		});
	}

	ngOnInit(): void {
	  this.getTransfer();
		this.getBankAccount();
	}

	save(entity: Transfer) {
		if (this.entityForm.valid){
		  this.loading = true;
		  this.loading = true;
		  entity.createdById = this._authService.getCurrentUser().id;
		  if (this.id != null && this.id !==''){
		      entity.id = +this.id;
		      return this.transferService.update(entity)
		      .subscribe(() => this.router.navigateByUrl('dashboard/transfer-list'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', 'An error has occurred. Please try again!')
		      });
		  } else {
		      return this.transferService.create(entity)
		      .subscribe(() => this.router.navigateByUrl('dashboard/transfer-list'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', 'An error has occurred. Please verify your informations and try again!')
		      });
		  }
		}
	}

	getTransfer(){
		if(this.id != null && this.id !== ""){
		this.formTitle = "Update transfer";
		  let id : number = +this.id;
		  return this.transferService.getSingle(id).subscribe(
		    result => {
		      this.entityForm.patchValue(result);
		    }, error => {
		      console.log(error);
		    }
		  );
		}
	}

	getBankAccount(){
	  return this.bankaccountService.getAll().subscribe( result => {
	    this.bankaccounts = result;
	  }, error => {
	    console.log(error);
	  });
	}

	showToast(status: NbComponentStatus, message: string): void {
		this.toastrService.show(status, message, { status, duration:4000 });
	}
}
