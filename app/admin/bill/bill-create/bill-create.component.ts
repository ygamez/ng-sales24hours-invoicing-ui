import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbDialogService, NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/app/service/auth.service';
import { BillService } from 'src/app/service/bill.service';
import { Bill } from 'src/app/models/bill';
import { VendorService } from 'src/app/service/vendor.service';
import { Vendor } from 'src/app/models/vendor';
import { BillItemCreateComponent } from './bill-item-create/bill-item-create.component';
import { BillLineItem } from 'src/app/models/billlineitem';
import { Status } from 'src/app/models/status';
import { DateService } from 'src/app/service/date.service';
import { DebitNoteService } from 'src/app/service/debitnote.service';
import { DebitNote } from 'src/app/models/debitnote';
import { CurrencyService } from 'src/app/service/currency.service';
import { Currency } from 'src/app/models/currency';
import { DeleteConfirmationComponent } from '../../delete-confirmation/delete-confirmation.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'bill-create',
	templateUrl: './bill-create.component.html',
	styleUrls: ['./bill-create.component.scss']
})
export class BillCreateComponent implements OnInit {
	formTitle: string = "New bill";
	entityForm: FormGroup;
	loading: boolean = false;
	id: string = this.activatedRoute.snapshot.params["id"];
	public vendors: Vendor[] = [];
  public vendor: Vendor;
	public billLineItems: BillLineItem[] = [];
  public prefix = "#BILL";
  public itemToUpdateIndex:number = -1;
  public totalPrice:number = 0;
  public totalDiscount: number = 0;
  public totalTax: number = 0;
  public subTotalPrice: number=0;
  public totalDebitNote: number=0;
  public status: string = Status.Draft;
  public badgeStatus: string = Status.BadgeDraft;
  public debitNotes: DebitNote[] = [];
  public currency: Currency;
  public currencies: Currency[];
  public stepperIndex: number = 0;
  public vendorPreviewLink: string;
  public errorMessage: string;
  public oneItemAtLeast: string;
  public requiredFields: string;

	constructor(private currencyService: CurrencyService,
    private _dialogService: NbDialogService,
    private translate: TranslateService,
		private billService : BillService,
		private router: Router,
		private _authService: AuthService,
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private vendorService: VendorService,
		private toastrService: NbToastrService,
    private debitNoteService: DebitNoteService,
    private dateService: DateService,
	){
		this.entityForm = this.fb.group({
		  description: '',
		  reference: ['',[Validators.required]],
		  vendorId: ['',[Validators.required]],
		  issueDate: new Date(),
		  billDate: new Date(),
		  orderNumber: '',
      currencyId: ['',[Validators.required]]
		});
    this.entityForm.get('reference').setValue(this.prefix);
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.oneItemAtLeast').subscribe(res => { this.oneItemAtLeast = res });
    this.translate.get('general.requiredFields').subscribe(res => { this.requiredFields = res });
	  this.getBill();
		this.getVendor();
    this.getCurrencies();
	}

	save(entity: Bill) {
		if (this.entityForm.valid ){
      if (this.billLineItems.length > 0){
        this.loading = true;
        entity.billLineItems = this.billLineItems;
        entity.createdById = this._authService.getCurrentUser().id;
        entity.createdBy = this._authService.getCurrentUser();
        entity.totalAmount = this.totalPrice;
        entity.totalDiscount = this.totalDiscount;
        entity.totalTax = this.totalTax;
        entity.subTotalPrice = this.subTotalPrice;
        entity.totalDebitNote = this.totalDebitNote;
        entity.status = this.status;
        entity.badgeStatus = this.badgeStatus;
        entity.originUrl = window.location.origin;
        entity.stepperIndex = this.stepperIndex;
        entity.vendorPreviewLink = this.vendorPreviewLink;
        if (this.vendors != null && this.vendors.length > 0){
          entity.vendor = this.vendors.find(x => x.id === entity.vendorId);
        }
        entity.billDate = this.dateService.adjustDateForTimeOffset(new Date(entity.billDate));
        entity.issueDate = this.dateService.adjustDateForTimeOffset(new Date(entity.issueDate));
        if (this.id != null && this.id !==''){
            entity.id = +this.id;
            return this.billService.update(entity)
            .subscribe((result) => this.router.navigateByUrl('/dashboard/bill/details/'+result.id),
            error => {
                this.loading = false;
                console.log(error);
                this.showToast('danger', this.errorMessage)
            });
        } else {
            return this.billService.create(entity)
            .subscribe((result) => this.router.navigateByUrl('/dashboard/bill/details/'+result.id),
            error => {
                this.loading = false;
                console.log(error);
                this.showToast('danger', this.errorMessage)
            });
        }
      }else{
        this.showToast('danger',this.errorMessage);
      }
		}else{
      this.showToast('warning',this.requiredFields);
    }
	}

	getBill(){
		if(this.id != null && this.id !== ""){
		this.formTitle = "Update bill";
		  const id : number = +this.id;
		  return this.billService.getSingle(id).subscribe(
		    result => {
          this.billLineItems = result.billLineItems;
          this.badgeStatus = result.badgeStatus;
          this.status = result.status;
          this.vendor = result.vendor;
          this.stepperIndex = result.stepperIndex;
          this.vendorPreviewLink = result.vendorPreviewLink;
		      this.entityForm.patchValue(result);
          this.getDebitNoteList(result.id);
          this.calculatePrice();
		    }, error => {
		      console.log(error);
		    }
		  );
		}
	}

	getVendor(){
	  return this.vendorService.getAll().subscribe( result => {
	    this.vendors = result;
	  }, error => {
	    console.log(error);
	  });
	}

	showToast(status: NbComponentStatus, message: string): void {
		this.toastrService.show(status, message, { status, duration:4000 });
	}

  /**
   * Open dialog to add an bill item
   */
  openAttributeDialog() {
    this._dialogService.open(BillItemCreateComponent, { closeOnBackdropClick: false })
      .onClose.subscribe(billItem => {
        if (billItem != null){
          if (this.itemToUpdateIndex === -1){
            this.billLineItems.push(billItem);
          }else{
            this.billLineItems[this.itemToUpdateIndex] = billItem;
            // keep this line to prevent update on the same row
          }
        }
        this.itemToUpdateIndex = -1;
        this.calculatePrice();
        // keep this line to prevent update on the same row
      });
  }

  selectVendor(id)  {
    this.vendor = this.vendors.find(x => x.id === id);
  }

  editItem(item : BillLineItem){
    this.itemToUpdateIndex = this.billLineItems.indexOf(item);
    this.billService.setLineItemToUpdate(item);
    this.openAttributeDialog();
  }

  calculatePrice(){
    this.subTotalPrice = 0;
    this.totalDiscount = 0;
    this.totalTax = 0;
    this.totalPrice = 0;
    this.billLineItems.forEach(item => {
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
    this.totalPrice = this.totalPrice - this.totalDebitNote;
    this.totalPrice  = Math.round((this.totalPrice  + Number.EPSILON) * 100) / 100;
  }

  deleteLineItem(item){
    if (item.id != undefined){
      this.deleteConfirmation(item);
    }else{
      this.billLineItems.splice(this.billLineItems.indexOf(item), 1);
      this.calculatePrice();
    }
  }

  deleteItem(item){
    return this.billService.deleteItem(item.id).subscribe(
      () => {
        this.billLineItems.splice(this.billLineItems.indexOf(item), 1);
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

  getDebitNoteList(billId: number) {
		return this.debitNoteService.getAllByBill(billId).subscribe( result => {
		  this.debitNotes = result;
      this.debitNotes.forEach(item => {
        this.totalDebitNote = this.totalDebitNote + item.amount;
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
