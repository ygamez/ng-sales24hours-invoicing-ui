import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbDialogService, NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/app/service/auth.service';
import { ManualJournalService } from 'src/app/service/manualjournal.service';
import { ManualJournal } from 'src/app/models/manualjournal';
import { ManualJournalLineItemService } from 'src/app/service/manualjournallineitem.service';
import { ManualJournalLineItem } from 'src/app/models/manualjournallineitem';
import { ManualJournalItemCreateComponent } from './manual-journal-item-create/manual-journal-item-create.component';
import { Status } from 'src/app/models/status';
import { DateService } from 'src/app/service/date.service';
import { Transaction } from 'src/app/models/transaction';
import { CategoryEnum } from 'src/app/models/category-enum';
import { CurrencyService } from 'src/app/service/currency.service';
import { Currency } from 'src/app/models/currency';
import { DeleteConfirmationComponent } from '../../delete-confirmation/delete-confirmation.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'manualjournal-create',
	templateUrl: './manualjournal-create.component.html',
	styleUrls: ['./manualjournal-create.component.scss']
})
export class ManualJournalCreateComponent implements OnInit {
	formTitle: string = "Add new manual journal";
	entityForm: FormGroup;
	loading: boolean = false;
	id: string = this.activatedRoute.snapshot.params["id"];
	public manualjournallineitems: ManualJournalLineItem[] = [];
  public prefix = "#MJL";
  public lastManualJournalId: number = this.activatedRoute.snapshot.params["lastManualJournalId"];
  public status: string = Status.Draft;
  public badgeStatus: string = "badge-dark";
  public itemToUpdateIndex:number = -1;
  public totalDebitPrice:number = 0;
  public totalCreditPrice:number = 0;
  public totalDebitTax: number = 0;
  public totalCreditTax: number = 0;
  public subTotalDebitPrice: number= 0;
  public subTotalCreditPrice: number= 0;
  public creditDifference: number = 0;
  public debitDifference: number = 0;
  public currencies: Currency[];
  public currency:Currency;
  public errorMessage: string;
  public equalDebitNCredit: string;
  public addTwoAccount: string;

	constructor(private currencyService: CurrencyService,
    private translate: TranslateService,
		private manualjournalService : ManualJournalService,
		private router: Router,
		private _authService: AuthService,
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private manualjournallineitemService: ManualJournalLineItemService,
		private toastrService: NbToastrService,
    private _dialogService: NbDialogService,
    private dateService: DateService
	){
		this.entityForm = this.fb.group({
		  date: [new Date(),[Validators.required]],
		  reference: ['',[Validators.required]],
		  notes: ['',[Validators.required]],
      currencyId: ['',[Validators.required]],
		});
    if (this.lastManualJournalId != null && this.lastManualJournalId > 0){
      this.entityForm.get('reference').setValue(this.prefix+ this.lastManualJournalId);
    }else{
      this.lastManualJournalId = 1;
      this.entityForm.get('reference').setValue(this.prefix+ this.lastManualJournalId);
    }
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.equalDebitNCredit').subscribe(res => this.equalDebitNCredit = res);
    this.translate.get('general.addTwoAccount').subscribe(res => this.addTwoAccount = res);
	  this.getManualJournal();
    this.getCurrencies();
	}

	save(entity: ManualJournal) {
		if (this.entityForm.valid){
      if (this.manualjournallineitems.length > 1){
        if (this.debitDifference === 0 && this.creditDifference === 0){
          this.loading = true;
          entity.subTotalDebitPrice = this.subTotalDebitPrice;
          entity.subTotalCreditPrice = this.subTotalCreditPrice;
          entity.totalCreditPrice = this.totalCreditPrice;
          entity.totalDebitPrice = this.totalDebitPrice;
          entity.totalDebitTax = this.totalDebitTax;
          entity.totalCreditTax = this.totalCreditTax;
          entity.debitDifference = this.debitDifference;
          entity.creditDifference = this.creditDifference;
          entity.manualJournalLineItems = this.manualjournallineitems;
          entity.createdById = this._authService.getCurrentUser().id;
          entity.date = this.dateService.adjustDateForTimeOffset(new Date(entity.date));
          entity.status = this.status;
          entity.badgeStatus = this.badgeStatus;

           //Create transaction
          const transaction = new Transaction();
          // transaction.accountId = entity.accountId;
          transaction.note = entity.notes;
          transaction.date = entity.date;
          transaction.createdById = entity.createdById;
          transaction.category = CategoryEnum.ManualJournal;
          transaction.totalTax = entity.totalCreditTax;
          transaction.amount = entity.totalCreditPrice;
          transaction.published = false;
          entity.transaction = transaction;

          if (this.id != null && this.id !==''){
            entity.id = +this.id;
            return this.manualjournalService.update(entity)
            .subscribe((result) => this.router.navigateByUrl('dashboard/manual-journal/details/'+result.id),
            error => {
                this.loading = false;
                console.log(error);
                this.showToast('danger',this.errorMessage);
            });
          } else {
            return this.manualjournalService.create(entity)
            .subscribe((result) => this.router.navigateByUrl('dashboard/manual-journal/details/'+result.id),
            error => {
                this.loading = false;
                console.log(error);
                this.showToast('danger', this.errorMessage);
            });
          }
        }else{
          this.showToast("warning",this.equalDebitNCredit);
        }
      }else{
        this.showToast("warning", this.addTwoAccount);
      }

		}
	}

	getManualJournal(){
		if(this.id != null && this.id !== ""){
		this.formTitle = "Update manual journal";
		  let id : number = +this.id;
		  return this.manualjournalService.getSingle(id).subscribe(
		    result => {
          this.manualjournallineitems = result.manualJournalLineItems;
          this.status = result.status;
		      this.entityForm.patchValue(result);
          this.calculatePrices();
          this.badgeStatus = result.badgeStatus;
          this.currency = result.currency;
		    }, error => {  console.log(error); }
		  );
		}
	}

	showToast(status: NbComponentStatus, message: string): void {
		this.toastrService.show(status, message, { status, duration:4000 });
	}

  deleteLineItem(item){
    if (item.id != undefined){
      this.deleteConfirmation(item);
    }else{
      this.manualjournallineitems.splice(this.manualjournallineitems.indexOf(item), 1);
      this.calculatePrices();
    }
  }

  deleteConfirmation(item) {
    this._dialogService.open(DeleteConfirmationComponent, { closeOnBackdropClick: false })
      .onClose.subscribe(result => {
        if(result === true){
          this.deleteItem(item);
        }
    });
  }

  deleteItem(item){
    return this.manualjournalService.deleteItem(item.id).subscribe(
      () => {
        this.manualjournallineitems.splice(this.manualjournallineitems.indexOf(item), 1);
        this.calculatePrices();
      },
      error => console.log(error)
    )
  }

  calculatePrices(){
    this.subTotalDebitPrice = 0;
    this.subTotalCreditPrice = 0;
    this.totalCreditTax = 0;
    this.totalDebitTax = 0;
    this.totalCreditPrice = 0;
    this.totalDebitPrice = 0;
    this.creditDifference = 0;
    this.debitDifference = 0;
    this.manualjournallineitems.forEach(item => {
      this.subTotalCreditPrice =  this.subTotalCreditPrice + item.credit;
      this.subTotalDebitPrice =  this.subTotalDebitPrice + item.debit;
      let creditTaxes = 0;
      let debitTaxes = 0;
      if (item.tax){
        creditTaxes = (item.credit * item.tax.rate)/100;
        debitTaxes = (item.debit * item.tax.rate)/100;
      }
      this.totalCreditTax = this.totalCreditTax + creditTaxes;
      this.totalDebitTax = this.totalDebitTax + debitTaxes;
    });
    this.totalCreditPrice = this.subTotalCreditPrice +  this.totalCreditTax;
    this.totalDebitPrice = this.subTotalDebitPrice +  this.totalDebitTax;
    if (this.totalCreditPrice > this.totalDebitPrice){
      this.creditDifference = this.totalCreditPrice - this.totalDebitPrice;
      this.debitDifference= undefined;
    }else if (this.totalDebitPrice > this.totalCreditPrice){
      this.debitDifference = this.totalDebitPrice - this.totalCreditPrice;
      this.creditDifference = undefined;
    }
  }

  editItem(item : ManualJournalLineItem){
    this.itemToUpdateIndex = this.manualjournallineitems.indexOf(item);
    this.manualjournalService.setLineItemToUpdate(item);
    this.openAttributeDialog();
  }

  openAttributeDialog() {
    this._dialogService.open(ManualJournalItemCreateComponent, { closeOnBackdropClick: false })
      .onClose.subscribe(invoiceItem => {
        if (invoiceItem != null){
          if (this.itemToUpdateIndex === -1){
            this.manualjournallineitems.push(invoiceItem);
          }else{
            this.manualjournallineitems[this.itemToUpdateIndex] = invoiceItem;
          }
        }
        this.itemToUpdateIndex = -1;
        this.calculatePrices();
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
