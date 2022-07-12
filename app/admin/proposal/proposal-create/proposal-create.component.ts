import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbDialogService, NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/app/service/auth.service';
import { ProposalService } from 'src/app/service/proposal.service';
import { Proposal } from 'src/app/models/proposal';
import { CustomerService } from 'src/app/service/customer.service';
import { Customer } from 'src/app/models/customer';
import { ProposalLineItem } from 'src/app/models/proposallineitem';
import { Status } from 'src/app/models/status';
import { DateService } from 'src/app/service/date.service';
import { ProposalItemCreateComponent } from './proposal-item-create/proposal-item-create.component';
import { Currency } from 'src/app/models/currency';
import { CurrencyService } from 'src/app/service/currency.service';
import { DeleteConfirmationComponent } from '../../delete-confirmation/delete-confirmation.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'proposal-create',
	templateUrl: './proposal-create.component.html',
	styleUrls: ['./proposal-create.component.scss']
})
export class ProposalCreateComponent implements OnInit {
	formTitle: string = "New proposal";
	entityForm: FormGroup;
	loading: boolean = false;
	id: string = this.activatedRoute.snapshot.params["id"];
	public customers: Customer[] = [];
  public customer: Customer;
	public proposalLineItems: ProposalLineItem[] = [];
  public prefix = "#EST";
  public itemToUpdateIndex:number = -1;
  public totalPrice:number = 0;
  public totalDiscount: number = 0;
  public totalTax: number = 0;
  public subTotalPrice: number=0;
  public totalCreditNote: number=0;
  public status: string = Status.Draft;
  public badgeStatus: string = Status.BadgeDraft;
  public currencies: Currency[];
  proposal: Proposal;
  editLoading: boolean = false;
  currency: Currency;
  customerPreviewUrl: string;
  stepperIndex: number = 0;
  declined: boolean;
  accepted: boolean;
  downloadUrl: string;
  errorMessage: string;
  deletedItem: string;
  oneItemAtLeast:string;
  requiredFields: string;

	constructor(private translate: TranslateService,
    private _dialogService: NbDialogService,
		private proposalService : ProposalService,
		private router: Router,
		private _authService: AuthService,
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private customerService: CustomerService,
		private toastrService: NbToastrService,
    private dateService: DateService,
    private currencyService:CurrencyService
	){
		this.entityForm = this.fb.group({
		  description: '',
		  reference: ['',[Validators.required]],
		  customerId: ['',[Validators.required]],
		  currencyId: ['',[Validators.required]],
		  issueDate: new Date(),
		  proposalDate: new Date(),
		  proposalNumber: '',
		});
    this.entityForm.get('reference').setValue(this.prefix);
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
    this.translate.get('general.oneItemAtLeast').subscribe(res => this.oneItemAtLeast = res);
    this.translate.get('general.requiredFields').subscribe(res => this.requiredFields = res);
	  this.getProposal();
		this.getCustomer();
    this.getCurrencies();
	}

	save(entity: Proposal) {
		if (this.entityForm.valid ){
      if (this.proposalLineItems.length > 0){
        this.loading = true;
        entity.proposalLineItems = this.proposalLineItems;
        entity.createdById = this._authService.getCurrentUser().id;
        entity.createdBy = this._authService.getCurrentUser();
        entity.totalAmount = this.totalPrice;
        entity.totalDiscount = this.totalDiscount;
        entity.totalTax = this.totalTax;
        entity.subTotalPrice = this.subTotalPrice;
        entity.totalCreditNote = this.totalCreditNote;
        entity.status = this.status;
        entity.badgeStatus = this.badgeStatus;
        entity.originUrl = window.location.origin;
        entity.customerPreviewUrl = this.customerPreviewUrl;
        entity.downloadUrl = this.downloadUrl;
        entity.stepperIndex = this.stepperIndex;
        entity.accepted = this.accepted;
        entity.declined = this.declined;
        if (this.customers != null && this.customers.length > 0){
          entity.customer = this.customers.find(x => x.id === entity.customerId);
        }
        entity.proposalDate = this.dateService.adjustDateForTimeOffset(new Date(entity.proposalDate));
        entity.issueDate = this.dateService.adjustDateForTimeOffset(new Date(entity.issueDate));
        if (this.id != null && this.id !==''){
            entity.id = +this.id;

            return this.proposalService.update(entity)
            .subscribe((result) => this.router.navigateByUrl('/dashboard/proposal/details/'+result.id),
            error => {
                this.loading = false;
                console.log(error);
                this.showToast('danger', this.errorMessage)
            });
        } else {
            entity.stepperIndex = 0;
            return this.proposalService.create(entity)
            .subscribe((result) => this.router.navigateByUrl('/dashboard/proposal/details/'+result.id),
            error => {
                this.loading = false;
                console.log(error);
                this.showToast('danger', this.errorMessage)
            });
        }
      }else{
        this.showToast('danger',this.oneItemAtLeast);
      }
		}else{
      this.showToast('danger',this.requiredFields);
    }
	}

	getProposal(){
		if(this.id != null && this.id !== ""){
    this.editLoading = true;
		this.formTitle = "Update proposal";
		  const id : number = +this.id;
		  return this.proposalService.getSingle(id).subscribe(
		    result => {
          this.currency = result.currency;
          this.proposalLineItems = result.proposalLineItems;
          this.status = result.status;
          this.badgeStatus = result.badgeStatus;
          this.customer = result.customer;
          this.customerPreviewUrl = result.customerPreviewUrl;
          this.stepperIndex = result.stepperIndex;
          this.accepted = result.accepted;
          this.declined = result.declined;
          this.downloadUrl = result.downloadUrl;
		      this.entityForm.patchValue(result);
          this.currency = result.currency
          this.editLoading = false;
          this.calculatePrice();
		    }, error => {
          this.editLoading = false;
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

  /**
   * Open dialog to add an proposal item
   */
  openAttributeDialog() {
    this._dialogService.open(ProposalItemCreateComponent, { closeOnBackdropClick: false })
      .onClose.subscribe(proposalItem => {
        if (proposalItem != null){
          if (this.itemToUpdateIndex === -1){
            this.proposalLineItems.push(proposalItem);
          }else{
            this.proposalLineItems[this.itemToUpdateIndex] = proposalItem;
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

  editItem(item : ProposalLineItem){
    this.itemToUpdateIndex = this.proposalLineItems.indexOf(item);
    this.proposalService.setLineItemToUpdate(item);
    this.openAttributeDialog();
  }

  calculatePrice(){
    this.subTotalPrice = 0;
    this.totalDiscount = 0;
    this.totalTax = 0;
    this.totalPrice = 0;
    this.proposalLineItems.forEach(item => {
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
    this.totalPrice  = Math.round((this.totalPrice  + Number.EPSILON) * 100) / 100;
  }

  deleteLineItem(item){
    if (item.id != undefined){
      this.deleteConfirmation(item);
    }else{
      this.proposalLineItems.splice(this.proposalLineItems.indexOf(item), 1);
      this.calculatePrice();
    }
  }

  deleteItem(item){
    return this.proposalService.deleteItem(item.id).subscribe(
      () => {
        this.proposalLineItems.splice(this.proposalLineItems.indexOf(item), 1);
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
