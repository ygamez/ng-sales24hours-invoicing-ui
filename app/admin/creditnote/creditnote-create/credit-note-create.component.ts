import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/app/service/auth.service';
import { CreditNoteService } from 'src/app/service/creditnote.service';
import { CreditNote } from 'src/app/models/creditnote';
import { InvoiceService } from 'src/app/service/invoice.service';
import { Invoice } from 'src/app/models/invoice';
import { Currency } from 'src/app/models/currency';
import { CurrencyService } from 'src/app/service/currency.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'creditnote-create',
	templateUrl: './credit-note-create.component.html',
	styleUrls: ['./credit-note-create.component.scss']
})
export class CreditNoteCreateComponent implements OnInit {
	entityForm: FormGroup;
	loading: boolean = false;
	id: string = this.activatedRoute.snapshot.params["id"];
	invoiceId: string = this.activatedRoute.snapshot.params["invoiceId"];
	public invoices: Invoice[] = [];
	public invoice: Invoice;
  public currency: Currency;
  public errorMessage: string;
  public deletedItem: string;

	constructor(private currencyService: CurrencyService,
		private creditnoteService : CreditNoteService,
		private router: Router,
    private translate: TranslateService,
		private _authService: AuthService,
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private invoiceService: InvoiceService,
		private toastrService: NbToastrService
	){
		this.entityForm = this.fb.group({
		  invoiceId: ['', [Validators.required]],
		  amount: ['',[Validators.required]],
		  date: new Date(),
		  description: '',
		});
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
    if (this.invoiceId != null && this.invoiceId != null){
      this.entityForm.get('invoiceId').setValue(+this.invoiceId);
    }
	  this.getCreditNote();
		this.getInvoice();
    this.getDefaultCurrency();
    if (this.invoiceId){
      this.invoice = this.invoices.find(x => x.id == +this.invoiceId);
      this.invoice.createdBy = null;
    }
	}

	save(entity: CreditNote) {
		if (this.entityForm.valid){
		  this.loading = true;
		  entity.createdById = this._authService.getCurrentUser().id;
      if (this.invoice != null) {
        entity.invoice = this.invoice;
      }

		  if (this.id != null && this.id !==''){
		      entity.id = +this.id;
		      return this.creditnoteService.update(entity)
		      .subscribe(() =>{
            if (this.invoiceId != null){
              this.router.navigateByUrl('dashboard/invoice/details/'+this.invoiceId);
            } else{
              this.router.navigateByUrl('dashboard/credit-note-list');
            }
          },
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', this.errorMessage)
		      });
		  } else {
		      return this.creditnoteService.create(entity)
		      .subscribe(() => this.router.navigateByUrl('dashboard/credit-note-list'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', this.errorMessage)
		      });
		  }
		}
	}

	getCreditNote(){
		if(this.id != null && this.id !== ""){
		  let id : number = +this.id;
		  return this.creditnoteService.getSingle(id).subscribe(
		    result => {
		      this.entityForm.patchValue(result);
		    }, error => {
		      console.log(error);
		    }
		  );
		}
	}

	getInvoice(){
	  return this.invoiceService.getAll().subscribe( result => {
	    this.invoices = result;
	  }, error => {
	    console.log(error);
	  });
	}

	showToast(status: NbComponentStatus, message: string): void {
		this.toastrService.show(status, message, { status, duration:4000 });
	}

  getDefaultCurrency(){
    return this.currencyService.getDefault().subscribe(
      result => {
        this.currency = result;
      },error => {
        console.log(error);
      }
    )
  }

  selectInvoice(id){
    this.invoice = this.invoices.find(x => x.id == id);
  }
}
