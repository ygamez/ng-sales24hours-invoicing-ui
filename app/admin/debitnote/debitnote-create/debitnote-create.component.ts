import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/app/service/auth.service';
import { DebitNoteService } from 'src/app/service/debitnote.service';
import { DebitNote } from 'src/app/models/debitnote';
import { BillService } from 'src/app/service/bill.service';
import { Bill } from 'src/app/models/bill';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'debitnote-create',
	templateUrl: './debitnote-create.component.html',
	styleUrls: ['./debitnote-create.component.scss']
})
export class DebitNoteCreateComponent implements OnInit {
	formTitle: string = "Add new debitnote";
	entityForm: FormGroup;
	loading: boolean = false;
	id: string = this.activatedRoute.snapshot.params["id"];
	billId: string = this.activatedRoute.snapshot.params["billId"];
	public bills: Bill[] = [];
  bill: Bill;
  public errorMessage: string;
  public deletedItem: string;

	constructor(private translate: TranslateService,
		private debitnoteService : DebitNoteService,
		private router: Router,
		private _authService: AuthService,
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private billService: BillService,
		private toastrService: NbToastrService
	){
		this.entityForm = this.fb.group({
		  billId: ['', [Validators.required]],
		  amount: ['',[Validators.required]],
		  date: new Date(),
		  description: '',
		});
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);

    if (this.billId != null && this.billId != null){
      this.entityForm.get('billId').setValue(+this.billId);
    }
	  this.getDebitNote();
		this.getBill();
    if (this.billId){
      this.bill = this.bills.find(x => x.id == +this.billId);
      this.bill.createdBy = null;
    }
	}

	save(entity: DebitNote) {
		if (this.entityForm.valid){
		  this.loading = true;
      if (this.bill != null) {
        entity.bill = this.bill;
      }
		  entity.createdById = this._authService.getCurrentUser().id;
		  if (this.id != null && this.id !==''){
		      entity.id = +this.id;
		      return this.debitnoteService.update(entity)
		      .subscribe(() =>{
            if (this.billId != null){
              this.router.navigateByUrl('dashboard/bill/details/'+this.billId);
            } else{
              this.router.navigateByUrl('debit-note-list');
            }
          },
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger',this.errorMessage);
		      });
		  } else {
		      return this.debitnoteService.create(entity)
		      .subscribe(() => this.router.navigateByUrl('dashboard/debit-note-list'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', this.errorMessage)
		      });
		  }
		}
	}

	getDebitNote(){
		if(this.id != null && this.id !== ""){
		this.formTitle = "Update debitnote";
		  let id : number = +this.id;
		  return this.debitnoteService.getSingle(id).subscribe(
		    result => {
		      this.entityForm.patchValue(result);
		    }, error => {
		      console.log(error);
		    }
		  );
		}
	}

	getBill(){
	  return this.billService.getAll().subscribe( result => {
	    this.bills = result;
	  }, error => {
	    console.log(error);
	  });
	}

	showToast(status: NbComponentStatus, message: string): void {
		this.toastrService.show(status, message, { status, duration:4000 });
	}

  selectBill(id){
    this.bill = this.bills.find(x => x.id == id);
  }
}
