import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/app/service/auth.service';
import { RevenueService } from 'src/app/service/revenue.service';
import { Revenue } from 'src/app/models/revenue';
import { ChartAccountsService } from 'src/app/service/chartaccounts.service';
import { ChartAccounts } from 'src/app/models/chartaccounts';
import { BankAccountService } from 'src/app/service/bankaccount.service';
import { BankAccount } from 'src/app/models/bankaccount';
import { CustomerService } from 'src/app/service/customer.service';
import { Customer } from 'src/app/models/customer';
import { InvoiceService } from 'src/app/service/invoice.service';
import { Invoice } from 'src/app/models/invoice';
import { DateService } from 'src/app/service/date.service';
import { Status } from 'src/app/models/status';
import { Transaction } from 'src/app/models/transaction';
import { CategoryEnum } from 'src/app/models/category-enum';
import { Receipt } from 'src/app/models/receipt';
import { PaymentMethod } from 'src/app/models/payment-method';
import { Currency } from 'src/app/models/currency';
import { CurrencyService } from 'src/app/service/currency.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'revenue-create',
	templateUrl: './revenue-create.component.html',
	styleUrls: ['./revenue-create.component.scss']
})
export class RevenueCreateComponent implements OnInit {
  formTitle: string = "Revenue";
	entityForm: FormGroup;
	loading: boolean = false;
	id: string = this.activatedRoute.snapshot.params["id"];
	invoiceId: string = this.activatedRoute.snapshot.params["invoiceId"];
	public bankaccounts: BankAccount[] = [];
	public customers: Customer[] = [];
	public invoice: Invoice;
	public chartaccounts: ChartAccounts[] = [];
  banks: BankAccount[] = [];
  paymentMethods = [
    PaymentMethod.BankTransfer,
    PaymentMethod.Cash,
    PaymentMethod.Cheque,
    PaymentMethod.CreditCard,
    PaymentMethod.Paypal,
    PaymentMethod.Other
  ];
  accountBalances: IAccount[] = [];
  accountCategories: IAccount[] = [];
  refundFor: string = "Refund for ";
  currency: Currency;
  currencies: Currency[];
  loadingEditData: boolean = false;
  testNumber: number = 0;
  errorMessage: string;
  deletedItem: string;
  transactionId: number = 0;

  // bank: BankAccount;
	constructor(private revenueService : RevenueService,
		private router: Router,
    private translate: TranslateService,
		private _authService: AuthService,
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private bankaccountService: BankAccountService,
		private customerService: CustomerService,
		private invoiceService: InvoiceService,
		private chartaccountsService: ChartAccountsService,
		private toastrService: NbToastrService,
    private currencyService: CurrencyService,
    private dateService: DateService){
		this.entityForm = this.fb.group({
		  date: [new Date()],
		  paymentMethod: [this.paymentMethods[0],[Validators.required]],
		  amount: ['',[Validators.required]],
		  totalTax: ['',[Validators.required]],
		  bankAccountId: [null,[Validators.required]],
		  customerId: ['',[Validators.required]],
		  reference:'',
		  description: [''],
		  accountId: null,
		  accountBalanceId: null,
		});
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
    this.getDefaultCurrency();
	  this.getRevenue();
		this.getCustomer();
		this.getInvoice(this.invoiceId);
		this.getBankAccount();
		this.getChartAccounts();

	}

  public findInvalidControls() {
    const invalid = [];
    const controls = this.entityForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    console.log(invalid)
    return invalid;
  }

	save(entity: Revenue) {
    console.log(this.entityForm.valid)
    console.log(entity)
    this.findInvalidControls();
		if (this.entityForm.valid){
		  this.loading = true;
      //this will prevent the date to be one day in the past
      entity.date = this.dateService.adjustDateForTimeOffset(new Date(entity.date));
		  entity.createdById = this._authService.getCurrentUser().id;
      if (this.invoice != null){
        entity.invoiceId = this.invoice.id;
        entity.invoice = this.invoice;
        // outstanding amount & revenue status
        if (entity.amount >= (entity.invoice.totalAmount - entity.invoice.paidAmount)){
          entity.invoice.status = Status.Paid;
          entity.invoice.badgeStatus = Status.BadgePaid;
          entity.invoice.paid =  true;
          entity.invoice.stepperIndex = 3;
        }else {
          entity.invoice.status = Status.PartialllyPaid;
          entity.invoice.badgeStatus = Status.BadgePartiallyPaid;
          entity.invoice.partiallyPaid =  true;
          entity.invoice.stepperIndex = 3;
        }
        // outstanding amount
        entity.invoice.paidAmount = entity.invoice.paidAmount + entity.amount;
        entity.invoice.remainingAmount = entity.invoice.totalAmount - entity.invoice.paidAmount;

        //create receipt
        const receipt = new Receipt();
        receipt.amount = entity.amount;
        receipt.createdAt = new Date();
        receipt.paymentCompleted = entity.invoice.paidAmount >= this.invoice.totalAmount;
        receipt.paymentMethod = entity.paymentMethod;
        entity.receipt = receipt;
      }
      if (entity.invoice != null) {
        entity.totalTax = entity.invoice.totalTax;
      }
      //Create transaction
      //Use currency converter if currency is different
      const transaction = new Transaction();
      if (this.transactionId !== 0) transaction.id = this.transactionId;
      transaction.accountId = entity.accountId;
      transaction.accountBalanceId = entity.accountBalanceId;
      transaction.note = entity.description;
      transaction.date = entity.date;
      transaction.createdById = entity.createdById;
      transaction.category = CategoryEnum.Income;
      transaction.amount = entity.amount;
      transaction.totalTax = entity.totalTax;
      if (this.currency != null  && entity.invoice != null
          && entity.invoice.currency != null && this.currency.isoCode !== entity.invoice.currency.isoCode){
        this.invoiceService.convertCurrency(entity.invoice.currency.isoCode, this.currency.isoCode, entity.amount).subscribe(
          result => {
            console.log(result.amount);
            transaction.amount = result.amount;
          }
        );
      }
      transaction.platform = "Application";

      transaction.published = true;
      entity.transaction = transaction;

		  if (this.id != null && this.id !==''){
		      entity.id = +this.id;
		      return this.revenueService.update(entity)
		      .subscribe(() => {
            if (this.invoiceId !== null && this.invoiceId !== undefined){
              this.router.navigateByUrl('/dashboard/invoice/details/'+this.invoiceId);
            }else{
              this.router.navigateByUrl('/dashboard/revenue-list');
            }
          },
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', this.errorMessage)
		      });
		  } else {
		      return this.revenueService.create(entity)
		      .subscribe(() => {
            if (this.invoiceId !== null && this.invoiceId !== undefined){
              this.router.navigateByUrl('/dashboard/invoice/details/'+this.invoiceId);
            }else{
              this.router.navigateByUrl('/dashboard/revenue-list');
            }

          },
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', this.errorMessage)
		      });
		  }
		}
	}

	getRevenue(){
		if(this.id != null && this.id !== ""){
		this.formTitle = "Update revenue";
		  let id : number = +this.id;
		  return this.revenueService.getSingle(id).subscribe(
		    result => {
          if (result != null ){
            this.entityForm.patchValue(result);
            this.transactionId = result.transactionId;
            this.getInvoice(result.invoiceId);
          }
		    }, error => {
		      console.log(error);
		    }
		  );
		}
	}

	getBankAccount(){
	  return this.bankaccountService.getAll().subscribe( result => {
	    this.banks = result.filter(x => x.type != "Stripe");
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

	getInvoice(id){
    if (id !== null && id !== ''){
      return this.invoiceService.getSingle(+this.invoiceId).subscribe( result => {
        this.invoice = result;
        if (this.invoice != null){
          this.entityForm.get('customerId').setValue(this.invoice.customerId);
          this.entityForm.get('totalTax').setValue(this.invoice.totalTax);
          // If there is an outstanding amount
          if (this.invoice.remainingAmount <= 0){
            this.entityForm.get('amount').setValue(this.invoice.totalAmount);
          }else{
            this.entityForm.get('amount').setValue(this.invoice.remainingAmount);
          }
          this.currency = result.currency;
        }
      }, error => {
        console.log(error);
      });
    }
	}

	getChartAccounts(){
	  return this.chartaccountsService.getAll().subscribe( result => {
	    this.chartaccounts = result;
      if (result != null){
        this.accountBalances = [];
        this.accountBalances.push(
          {
            category: "Cash and Bank",
            accounts: result.filter(x => x.accountType.name === "Cash and Bank")
          },
          {
            category: "Money in Transit",
            accounts: result.filter(x => x.accountType.name === "Money in Transit")
          },
          {
            category: "Inventory",
            accounts: result.filter(x => x.accountType.name === "Inventory")
          },
          {
            category: "Property, Plant, Equipment",
            accounts: result.filter(x => x.accountType.name === "Property, Plant, Equipment")
          },
          {
            category: "Vendor Prepayments and Vendor Credits",
            accounts: result.filter(x => x.accountType.name === "Vendor Prepayments and Vendor Credits")
          },
          {
            category: "Other Short-Term Asset",
            accounts: result.filter(x => x.accountType.name === "Other Short-Term Asset")
          },
          {
            category: "Other Long-Term Asset",
            accounts: result.filter(x => x.accountType.name === "Other Long-Term Asset")
          },
          {
            category: "Credit Card",
            accounts: result.filter(x => x.accountType.name === "Credit Card")
          },
          {
            category: "Loan and Line of Credit",
            accounts: result.filter(x => x.accountType.name === "Loan and Line of Credit")
          },
          {
            category: "Due to You and Other Business Owners",
            accounts: result.filter(x => x.accountType.name === "Due to You and Other Business Owners")
          },
          {
            category: "Customer Prepayments and Customer Credits",
            accounts: result.filter(x => x.accountType.name === "Customer Prepayments and Customer Credits")
          },
          {
            category: "Other Short-Term Liability",
            accounts: result.filter(x => x.accountType.name === "Other Short-Term Liability")
          },
          {
            category: "Other Long-Term Liability",
            accounts: result.filter(x => x.accountType.name === "Other Long-Term Liability")
          },
          {
            category: "Business Owner Contribution and Drawing",
            accounts: result.filter(x => x.accountType.name === "Business Owner Contribution and Drawing")
          },
        );

        this.accountCategories = [];
        this.accountCategories.push(
          {
            category: "Income",
            accounts: result.filter(x => x.accountType.accountTypeCategory.name === "Income")
          },
          {
            category: "Refund for expense",
            accounts: result.filter(x => x.accountType.accountTypeCategory.name === "Expenses")
          },
          {
            category: "Transferts",
            accounts:  result.filter(x =>
              x.accountType.name === "Credit Card" ||
              x.accountType.name === "Cash and Bank"||
              x.accountType.name === "Loan and Line of Credit"
            )
          },
          {
            category: "Expected Payments from Customers",
            accounts: result.filter(x => x.accountType.name === "Expected Payments from Customers")
          },
          {
            category: "Depreciation and Amortization",
            accounts: result.filter(x => x.accountType.name === "Depreciation and Amortization")
          },
          {
            category: "Expected Payments to Vendors",
            accounts: result.filter(x => x.accountType.name === "Expected Payments to Vendors")
          },
          {
            category: "Due For Payroll",
            accounts: result.filter(x => x.accountType.name === "Due For Payroll")
          },
          {
            category: "Retained Earnings: Profit",
            accounts: result.filter(x => x.accountType.name === "Retained Earnings: Profit")
          },
        );
      }
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
}

interface IAccount{
  category: string;
  accounts: ChartAccounts[];
}
