import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/app/service/auth.service';
import { PaymentService } from 'src/app/service/payment.service';
import { Payment } from 'src/app/models/payment';
import { BankAccountService } from 'src/app/service/bankaccount.service';
import { BankAccount } from 'src/app/models/bankaccount';
import { VendorService } from 'src/app/service/vendor.service';
import { Vendor } from 'src/app/models/vendor';
import { BillService } from 'src/app/service/bill.service';
import { Bill } from 'src/app/models/bill';
import { ChartAccountsService } from 'src/app/service/chartaccounts.service';
import { ChartAccounts } from 'src/app/models/chartaccounts';
import { DateService } from 'src/app/service/date.service';
import { Status } from 'src/app/models/status';
import { Transaction } from 'src/app/models/transaction';
import { CategoryEnum } from 'src/app/models/category-enum';
import { Currency } from 'src/app/models/currency';
import { CurrencyService } from 'src/app/service/currency.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'payment-create',
	templateUrl: './payment-create.component.html',
	styleUrls: ['./payment-create.component.scss']
})
export class PaymentCreateComponent implements OnInit {
	formTitle: string = "Add new expense";
	entityForm: FormGroup;
	loading: boolean = false;
	id: string = this.activatedRoute.snapshot.params["id"];
	billId: string = this.activatedRoute.snapshot.params["billId"];
	public bankaccounts: BankAccount[] = [];
	public vendors: Vendor[] = [];
	public bill: Bill;
	public chartaccounts: ChartAccounts[] = [];
  banks: BankAccount[] = [];
  accountBalances: IAccount[] = [];
  accountCategories: IAccount[] = [];
  currency: Currency;
  errorMessage: string;
  deletedItem: string;
  transactionId: number = 0;

	constructor(private currencyService: CurrencyService,
		private paymentService : PaymentService,
		private router: Router,
		private _authService: AuthService,
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private bankaccountService: BankAccountService,
		private vendorService: VendorService,
		private billService: BillService,
		private chartaccountsService: ChartAccountsService,
		private toastrService: NbToastrService,
    private dateService: DateService,
    private translate: TranslateService
	){
		this.entityForm = this.fb.group({
		  date: [new Date()],
		  amount: ['',[Validators.required]],
		  totalTax: ['',[Validators.required]],
		  bankAccountId: [null,[Validators.required]],
		  vendorId: null,
		  reference:'',
		  description: [''],
		  // billId: 0,
		  accountId: null,
		  accountBalanceId: null,
		});
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
	  this.getPayment();
		this.getVendor();
		this.getBill(this.billId);
		this.getBankAccount();
		this.getChartAccounts();
    this.getDefaultCurrency();
	}

	save(entity: Payment) {
		if (this.entityForm.valid) {
		  this.loading = true;
		  this.loading = true;
      //this will prevent the date to be one day in the past
      entity.date = this.dateService.adjustDateForTimeOffset(new Date(entity.date));
		  entity.createdById = this._authService.getCurrentUser().id;

      if (this.bill != null){
        entity.billId = this.bill.id;
        entity.bill = this.bill;
        // outstanding amount & payment status
        if (entity.amount >= (entity.bill.totalAmount - entity.bill.paidAmount)){
          entity.bill.status = Status.Paid;
          entity.bill.badgeStatus = Status.BadgePaid;
          entity.bill.paid =  true;
          entity.bill.stepperIndex = 3;
        }
        else {
          entity.bill.status = Status.PartialllyPaid;
          entity.bill.badgeStatus = Status.BadgePartiallyPaid;
          entity.bill.partiallyPaid =  true;
          entity.bill.stepperIndex = 3;
        }
        // outstanding amount
        entity.bill.paidAmount = entity.bill.paidAmount + entity.amount;
        entity.bill.remainingAmount = entity.bill.totalAmount - entity.bill.paidAmount;
      }

      //Create transaction
      const transaction = new Transaction();
      if(this.transactionId != 0 ) transaction.id = this.transactionId;
      transaction.accountId = entity.accountId;
      transaction.accountBalanceId = entity.accountBalanceId;
      transaction.note = entity.description;
      transaction.date = entity.date;
      transaction.createdById = entity.createdById;
      transaction.category = CategoryEnum.Expense;
      transaction.amount = entity.amount;
      transaction.platform = "Application";
      if(entity.bill != null) {
        entity.totalTax = entity.bill.totalTax;
      }
      transaction.totalTax = entity.totalTax;
      transaction.published = true;
      entity.transaction = transaction;

		  if (this.id != null && this.id !== undefined){
		      entity.id = +this.id;
		      return this.paymentService.update(entity)
		      .subscribe(() => this.router.navigateByUrl('/dashboard/payment-list'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger',  this.errorMessage)
		      });
		  } else {
		      return this.paymentService.create(entity)
		      .subscribe(() => {
            if (this.billId !== null && this.billId !== undefined){
              this.router.navigateByUrl('/dashboard/bill/details/'+this.billId);
            }else{
              this.router.navigateByUrl('/dashboard/payment-list');
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

	getPayment(){
		if(this.id != null && this.id !== ""){
		this.formTitle = "Update payment";
		  let id : number = +this.id;
		  return this.paymentService.getSingle(id).subscribe(
		    result => {
          if (result != null ){
            this.entityForm.patchValue(result);
            this.transactionId = result.transactionId;
            this.getBill(result.billId);
          }
		    }, error => {
		      console.log(error);
		    }
		  );
		}
	}

	getBankAccount(){
	  return this.bankaccountService.getAll().subscribe( result => {
	    this.banks = result.filter(x => x.type != "Stripe" );
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

	getBill(id){
    if (id !== null && id !== ''){
      return this.billService.getSingle(+this.billId).subscribe( result => {
        this.bill = result;
        if (this.bill != null){
          this.currency = result.currency;
          this.entityForm.get('vendorId').setValue(this.bill.vendorId);
          this.entityForm.get('totalTax').setValue(this.bill.totalTax);
          // If there is an outstanding amount
          if (this.bill.remainingAmount <= 0){
            this.entityForm.get('amount').setValue(this.bill.totalAmount);
          }else{
            this.entityForm.get('amount').setValue(this.bill.remainingAmount);
          }

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
            category: "Other Short-Term Liability",
            accounts: result.filter(x => x.accountType.name === "Other Short-Term Liability")
          },
          {
            category: "Business Owner Contribution and Drawing",
            accounts: result.filter(x => x.accountType.name === "Business Owner Contribution and Drawing")
          },
        );

        //Create bill payment category
        //Create expense
        //Add ability to create transfert between account
        //Add abillity to create refund
        this.accountCategories = [];
        this.accountCategories.push(
          {
            category: "Operating Expense",
            accounts: result.filter(x => x.accountType.name === "Operating Expense")
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
            category: "Refund for income",
            accounts: result.filter(x => x.accountType.accountTypeCategory.name === "Income")
          },
          {
            category: "Cost of Goods Sold",
            accounts: result.filter(x => x.accountType.name === "Cost of Goods Sold")
          },
          {
            category: "Payment Processing Fee",
            accounts: result.filter(x => x.accountType.name === "Payment Processing Fee")
          },
          {
            category: "Uncategorized Expense",
            accounts: result.filter(x => x.accountType.name === "Uncategorized Expense")
          },
          {
            category: "Loss On Foreign Exchange",
            accounts: result.filter(x => x.accountType.name === "Loss On Foreign Exchange")
          },
          {
            category: "Payroll Expense",
            accounts: result.filter(x => x.accountType.name === "Payroll Expense")
          },
          {
            category: "Inventory",
            accounts: result.filter(x => x.accountType.name === "Inventory")
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
            category: "Vendor Prepayments and Vendor Credits",
            accounts: result.filter(x => x.accountType.name === "Vendor Prepayments and Vendor Credits")
          },
          {
            category: "Property, Plant, Equipment",
            accounts: result.filter(x => x.accountType.name === "Property, Plant, Equipment")
          },
          {
            category: "Expected Payments to Vendors",
            accounts: result.filter(x => x.accountType.name === "Expected Payments to Vendors")
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
            category: "Other Long-Term Liability",
            accounts: result.filter(x => x.accountType.name === "Other Long-Term Liability")
          },
          {
            category: "Due For Payroll",
            accounts: result.filter(x => x.accountType.name === "Due For Payroll")
          },
          {
            category: "Retained Earnings: Profit",
            accounts: result.filter(x => x.accountType.name === "Retained Earnings: Profit")
          },
        )
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
