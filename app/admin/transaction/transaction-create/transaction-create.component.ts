import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/app/service/auth.service';
import { TransactionService } from 'src/app/service/transaction.service';
import { Transaction } from 'src/app/models/transaction';
import { PaymentService } from 'src/app/service/payment.service';
import { Payment } from 'src/app/models/payment';
import { RevenueService } from 'src/app/service/revenue.service';
import { Revenue } from 'src/app/models/revenue';

@Component({
	selector: 'transaction-create',
	templateUrl: './transaction-create.component.html',
	styleUrls: ['./transaction-create.component.scss']
})
export class TransactionCreateComponent implements OnInit {
	formTitle: string = "Add new transaction";
	entityForm: FormGroup;
	loading: boolean = false;
	id: string = this.activatedRoute.snapshot.params["id"];
	public payments: Payment[] = [];
	public revenues: Revenue[] = [];

	constructor(
		private transactionService : TransactionService,
		private router: Router,
		private _authService: AuthService,
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private paymentService: PaymentService,
		private revenueService: RevenueService,
		private toastrService: NbToastrService
	){
		this.entityForm = this.fb.group({
		  note : '',
		  amount: '',
		  date: new Date(),

		});
	}

	ngOnInit(): void {
	  this.getTransaction();
		this.getPayment();
		this.getRevenue();
	}

	save(entity: Transaction) {
		if (this.entityForm.valid){
		  this.loading = true;
		  this.loading = true;
		  entity.createdById = this._authService.getCurrentUser().id;
		  if (this.id != null && this.id !==''){
		      entity.id = +this.id;
		      return this.transactionService.update(entity)
		      .subscribe(() => this.router.navigateByUrl('dashboard/transaction-list'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', 'An error has occurred. Please try again!')
		      });
		  } else {
		      return this.transactionService.create(entity)
		      .subscribe(() => this.router.navigateByUrl('dashboard/transaction-list'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', 'An error has occurred. Please verify your informations and try again!')
		      });
		  }
		}
	}

	getTransaction(){
		if(this.id != null && this.id !== ""){
		this.formTitle = "Update transaction";
		  let id : number = +this.id;
		  return this.transactionService.getSingle(id).subscribe(
		    result => {
		      this.entityForm.patchValue(result);
		    }, error => {
		      console.log(error);
		    }
		  );
		}
	}

	getPayment(){
	  return this.paymentService.getAll().subscribe( result => {
	    this.payments = result;
	  }, error => {
	    console.log(error);
	  });
	}

	getRevenue(){
	  return this.revenueService.getAll().subscribe( result => {
	    this.revenues = result;
	  }, error => {
	    console.log(error);
	  });
	}

	showToast(status: NbComponentStatus, message: string): void {
		this.toastrService.show(status, message, { status, duration:4000 });
	}
}
