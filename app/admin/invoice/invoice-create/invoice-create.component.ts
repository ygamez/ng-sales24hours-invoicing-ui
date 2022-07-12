import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbDialogService, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { CreditNote } from 'src/app/models/creditnote';
import { Currency } from 'src/app/models/currency';
import { Customer } from 'src/app/models/customer';
import { Invoice } from 'src/app/models/invoice';
import { InvoiceLineItem } from 'src/app/models/invoicelineitem';
import { Status } from 'src/app/models/status';
import { Subscription } from 'src/app/models/subscription';
import { AuthService } from 'src/app/service/auth.service';
import { CreditNoteService } from 'src/app/service/creditnote.service';
import { CurrencyService } from 'src/app/service/currency.service';
import { CustomerService } from 'src/app/service/customer.service';
import { DateService } from 'src/app/service/date.service';
import { InvoiceService } from 'src/app/service/invoice.service';
import { SubscriptionService } from 'src/app/service/subscription.service';
import { DeleteConfirmationComponent } from '../../delete-confirmation/delete-confirmation.component';
import { InvoiceItemCreateComponent } from './invoice-item-create/invoice-item-create.component';

@Component({
  selector: 'app-invoice-create',
  templateUrl: './invoice-create.component.html',
  styleUrls: ['./invoice-create.component.scss']
})
export class InvoiceCreateComponent implements OnInit {
	formTitle: string = "Nueva Factura";
	entityForm: FormGroup;
	loading: boolean = false;
	id: string = this.activatedRoute.snapshot.params["id"];
	public customers: Customer[] = [];
  public customer: Customer;
	public invoiceLineItems: InvoiceLineItem[] = [];
  public prefix = "#INV";
  public itemToUpdateIndex:number = -1;
  public totalPrice:number = 0;
  public totalDiscount: number = 0;
  public totalTax: number = 0;
  public subTotalPrice: number=0;
  public totalCreditNote: number=0;
  public status: string = Status.Draft;
  public badgeStatus: string = Status.BadgeDraft;
  public creditNotes: CreditNote[] = [];
  private originUrl = window.location.origin;
  public currencies: Currency[];
  public currency: Currency;
  public stepperIndex: number = 0;
  public customerPreviewUrl: string;
  public subscription: Subscription;
  public downloadUrl: string;
  errorMessage: string;
  deletedItem: string;
  oneItemAtLeast:string;
  requiredFields: string;

	constructor(private currencyService: CurrencyService,
    private _dialogService: NbDialogService,
		private invoiceService : InvoiceService,
		private router: Router,
    private translate: TranslateService,
		private _authService: AuthService,
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private customerService: CustomerService,
		private toastrService: NbToastrService,
    private creditNoteService: CreditNoteService,
    private dateService: DateService,
    private subscriptionService: SubscriptionService,
    private authService: AuthService){
    if (this.subscription != null && this.subscription.plan != null && this.subscription.plan.maxOrder > 0){
      this.router.navigateByUrl("/dashboard/setting-list/pricings");
    }
		this.entityForm = this.fb.group({
		  description: '',
		  reference: ['',[Validators.required]],
		  customerId: ['',[Validators.required]],
		  issueDate: new Date(),
		  invoiceDate: new Date(),
		  invoiceNumber: '',
		  currencyId: ['',[Validators.required]],
      isRecurring: false,
		});
    this.entityForm.get('reference').setValue(this.prefix);
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
    this.translate.get('general.oneItemAtLeast').subscribe(res => this.oneItemAtLeast = res);
    this.translate.get('general.requiredFields').subscribe(res => this.requiredFields = res);
	  this.getInvoice();
		this.getCustomer();
    this.getCurrencies();
	}

	save(entity: Invoice) {
		if (this.entityForm.valid ){
      if (this.invoiceLineItems.length > 0){
        this.loading = true;
        entity.invoiceLineItems = this.invoiceLineItems;
        entity.createdById = this._authService.getCurrentUser().id;
        entity.createdBy = this._authService.getCurrentUser();
        entity.currentUrl = this.originUrl;
        entity.totalAmount = this.totalPrice;
        entity.totalDiscount = this.totalDiscount;
        entity.totalTax = this.totalTax;
        entity.subTotalPrice = this.subTotalPrice;
        entity.totalCreditNote = this.totalCreditNote;
        entity.status = this.status;
        entity.badgeStatus = this.badgeStatus;
        entity.invoiceDate = this.dateService.adjustDateForTimeOffset(new Date(entity.invoiceDate));
        entity.issueDate = this.dateService.adjustDateForTimeOffset(new Date(entity.issueDate));
        entity.stepperIndex = this.stepperIndex;
        entity.customerPreviewUrl = this.customerPreviewUrl;
        entity.downloadUrl = this.downloadUrl;
        if (this.customers != null && this.customers.length > 0) {
          entity.customer = this.customers.find(x => x.id === entity.customerId);
        }
        if (this.id != null && this.id !==''){
            entity.id = +this.id;
            return this.invoiceService.update(entity)
            .subscribe((result) => {
              if (result != null){
                this.router.navigateByUrl('dashboard/invoice/details/'+result.id);
              }
            },
            error => {
                this.loading = false;
                console.log(error);
                this.showToast('danger', this.errorMessage)
            });
        } else {
            return this.invoiceService.create(entity)
            .subscribe((result) => {
              if (result != null){
                this.router.navigateByUrl('dashboard/invoice/details/'+result.id);
              }
            },
            error => {
                this.loading = false;
                console.log(error);
                this.showToast('danger', this.errorMessage)
            });
        }
      }else{
        this.showToast('danger', this.oneItemAtLeast);
      }
		}else{
      this.showToast('danger', this.requiredFields);
    }
	}

	getInvoice(){
		if(this.id != null && this.id !== ""){
		this.formTitle = "Update invoice";
		  const id : number = +this.id;
		  return this.invoiceService.getSingle(id).subscribe(
		    result => {
          this.invoiceLineItems = result.invoiceLineItems;
          this.status = result.status;
          this.badgeStatus = result.badgeStatus;
          this.customer = result.customer;
		      this.entityForm.patchValue(result);
          this.currency = result.currency;
          this.stepperIndex = result.stepperIndex;
          this.customerPreviewUrl = result.customerPreviewUrl;
          this.downloadUrl = result.downloadUrl;
          this.getCreditNoteList(result.id);
          this.calculatePrice();
		    }, error => {
		      console.log(error);
		    }
		  );
		}
	}

	getCustomer(){
	  return this.customerService.getAll().subscribe( result => {
	    this.customers = result;
	  }, error => {
	    console.log(error);
	  });
	}

	showToast(status: NbComponentStatus, message: string): void {
		this.toastrService.show(status, message, { status, duration:4000 });
	}

  openAttributeDialog() {
    this._dialogService.open(InvoiceItemCreateComponent, { closeOnBackdropClick: false })
      .onClose.subscribe(invoiceItem => {
        if (invoiceItem != null){
          if (this.itemToUpdateIndex === -1){
            this.invoiceLineItems.push(invoiceItem);
          }else{
            this.invoiceLineItems[this.itemToUpdateIndex] = invoiceItem;
            // keep this line to prevent update on the same row
          }
        }
        this.itemToUpdateIndex = -1;
        this.calculatePrice();
        // keep this line to prevent update on the same row
      });
  }

  selectCustomer(id)  {
    this.customer = this.customers.find(x => x.id === id);
  }

  editItem(item : InvoiceLineItem){
    this.itemToUpdateIndex = this.invoiceLineItems.indexOf(item);
    this.invoiceService.setLineItemToUpdate(item);
    this.openAttributeDialog();
  }

  calculatePrice(){
    this.subTotalPrice = 0;
    this.totalDiscount = 0;
    this.totalTax = 0;
    this.totalPrice = 0;
    this.invoiceLineItems.forEach(item => {
      this.subTotalPrice =  this.subTotalPrice + item.totalPrice;
      const discounts = (item.totalPrice * item.discount) / 100;
      this.totalDiscount = this.totalDiscount + discounts;
      if(item.product != null){
        if (item.product.tax != null){
          const taxes = (item.totalPrice * item.product.tax.rate)/100;
          this.totalTax = this.totalTax + taxes;
        }
      }else{
        if (item.service.tax != null){
          const taxes = (item.totalPrice * item.service.tax.rate)/100;
          this.totalTax = this.totalTax + taxes;
        }
      }
      this.totalPrice = this.subTotalPrice + this.totalTax - this.totalDiscount;
    });
    this.totalPrice = this.totalPrice - this.totalCreditNote;
    this.totalPrice  = Math.round((this.totalPrice  + Number.EPSILON) * 100) / 100;

  }

  deleteLineItem(item){
    if (item.id != undefined){
      this.deleteConfirmation(item);
    }else{
      this.invoiceLineItems.splice(this.invoiceLineItems.indexOf(item), 1);
      this.calculatePrice();
    }
  }


  deleteItem(item){
    return this.invoiceService.deleteItem(item.id).subscribe(
      () => {
        this.invoiceLineItems.splice(this.invoiceLineItems.indexOf(item), 1);
        this.calculatePrice();
      },
      error => console.log(error)
    )
  }

  deleteConfirmation(item) {
    this._dialogService.open(DeleteConfirmationComponent, { closeOnBackdropClick: false })
      .onClose.subscribe(result => {
        if(result === true){
          this.deleteItem(item);
        }
    });
  }

  getCreditNoteList(invoiceId: number) {
		return this.creditNoteService.getAllByInvoice(invoiceId).subscribe( result => {
		  this.creditNotes = result;
      this.creditNotes.forEach(item => {
        this.totalCreditNote = this.totalCreditNote + item.amount;
      });
      this.calculatePrice();
		}, (error) => {
		  console.log(error);
		});
	}

  getCurrencies() {
		return this.currencyService.getAll().subscribe( result => {
      this.currencies = result.filter(x => x.userRole === "setting-list");
		}, (error) => {
		  console.log(error);
		});
	}

  selectCurrency(id){
    this.currency = this.currencies.find(x => x.id == id);
  }

}
