import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbComponentStatus, NbDialogRef, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { InvoiceItemCreateComponent } from 'src/app/admin/invoice/invoice-create/invoice-item-create/invoice-item-create.component';
import { ChartAccounts } from 'src/app/models/chartaccounts';
import { Customer } from 'src/app/models/customer';
import { ManualJournalLineItem } from 'src/app/models/manualjournallineitem';
import { Taxe } from 'src/app/models/taxe';
import { Vendor } from 'src/app/models/vendor';
import { ChartAccountsService } from 'src/app/service/chartaccounts.service';
import { CustomerService } from 'src/app/service/customer.service';
import { ManualJournalService } from 'src/app/service/manualjournal.service';
import { TaxeService } from 'src/app/service/taxe.service';
import { VendorService } from 'src/app/service/vendor.service';

@Component({
  selector: 'app-manual-journal-item-create',
  templateUrl: './manual-journal-item-create.component.html',
  styleUrls: ['./manual-journal-item-create.component.scss']
})
export class ManualJournalItemCreateComponent implements OnInit {
  formTitle: string = "Add an customer or vendor";
	entityForm: FormGroup;
	loading: boolean = false;
	id: string = this.activatedRoute.snapshot.params["id"];
	public vendors: Vendor[] = [];
	public tax: Taxe;
	public taxes: Taxe[] = [];
	public customers: Customer[] = [];
  public isCustomer: boolean = true;
  public customer: Customer;
  public vendor: Vendor;
  public accounts: ChartAccounts[];
  public account: ChartAccounts;

	constructor(private translate: TranslateService,
    private manualJournalService: ManualJournalService,
    private accountService: ChartAccountsService,
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private vendorService: VendorService,
		private taxeService: TaxeService,
		private customerService : CustomerService,
		private toastrService: NbToastrService,
    private dialogRef: NbDialogRef<ManualJournalItemCreateComponent>){
		this.entityForm = this.fb.group({
      vendorId:'',
		  customerId: '',
		  debit: null,
		  credit: null,
		  taxId: '',
		  description: '',
		  accountId: ['',[Validators.required]],
		  category: ['customer',[Validators.required]],
      update:false,
		});
    this.getItemToUpdate();
	}

	ngOnInit(): void {
	  // this.getManualJournalItem();
    this.getAccount();
		this.getVendor();
		this.getTaxe();
		this.getCustomer();
	}

	save(entity: ManualJournalLineItem) {
    this.loading = true;
		if (this.entityForm.valid && (this.customer != null || this.vendor != null)){
      if (this.customer == null) entity.customerId = null;
      if (this.vendor == null) entity.vendorId = null;
      if(!entity.update){
        entity.customer = this.customer;
        entity.vendor = this.vendor;
        entity.account = this.account;
        entity.tax = this.tax;
        this.dialogRef.close(entity);
      }else{
        this.manualJournalService.setLineItemToUpdate(entity);
        this.dialogRef.close(entity);
      }
		}
	}

  onCreditChange(ev){
    var value = ev.target.value;
  }

  getAccount(){
	  return this.accountService.getAll().subscribe( result => {
	    this.accounts = result;
	  }, error => {
	    console.log(error);
	  });
	}

	getVendor(){
	  return this.vendorService.getAll().subscribe( result => {
	    this.vendors = result;
	  }, error => {
	    console.log(error);
	  });
	}

	getTaxe(){
	  return this.taxeService.getAll().subscribe( result => {
	    this.taxes = result.filter(x => x.type === "setting-list");
	  }, error => {
	    console.log(error);
	  });
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

  selectedCategory(value){
    if (value === 'customer'){
      this.isCustomer = true;
    }else {
      this.isCustomer = false;
    }
  }

  close() {
    this.dialogRef.close();
  }

  selectCustomer(id){
    this.customer = this.customers.find(x => x.id === id);
    // this.setupItem();
  }

  selectTax(id){
    this.tax = this.taxes.find(x => x.id === id);
    // this.setupItem();
  }

  selectAccount(id){
    this.account = this.accounts.find(x => x.id === id);
    // this.setupItem();
  }

  selectVendor(id){
    this.vendor = this.vendors.find(x => x.id === id);
  }

  quantityChange(ev){
    var  qte = ev.target.value;
    var price = this.entityForm.get('price');
    var totalPrice = this.entityForm.get('totalPrice');
    totalPrice.setValue(price.value * qte);
  }

  getItemToUpdate(){
    if (this.manualJournalService.getLineItemToUpdate() != null){
      const itemToUpdate = this.manualJournalService.getLineItemToUpdate();
      this.customer = itemToUpdate.customer;
      this.vendor = itemToUpdate.vendor;
      this.account = itemToUpdate.account;
      this.tax = itemToUpdate.tax;
      if (this.customer != null){
        this.isCustomer = true;
        this.vendor = null;
      }else {
        this.isCustomer = false;
        this.customer = null;
      }
      this.entityForm.patchValue(itemToUpdate);
      this.manualJournalService.setLineItemToUpdate(null);
    }
  }

  onCreditKeyUp(value) {
   if (value.length > 0){
    this.entityForm.get('debit').setValue(null);
   }
  }

  onDebitKeyUp(value) {
    if (value.length > 0){
     this.entityForm.get('credit').setValue(null);
    }
   }
}
