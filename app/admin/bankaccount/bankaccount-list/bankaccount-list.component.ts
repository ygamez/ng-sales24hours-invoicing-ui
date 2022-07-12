import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService, NbComponentStatus, NbDialogService, NbThemeService, NbColorHelper } from '@nebular/theme';
import { BankAccountService } from 'src/app/service/bankaccount.service';
import { BankAccount } from 'src/app/models/bankaccount';
import { TableService } from 'src/app/service/table.service';
import { AttributeType } from 'src/app/models/attributeType';
import { NgbdSortableHeader, SortEvent } from 'src/app/directive/sortable.directive';
import { Observable } from 'rxjs';
import { DeleteConfirmationComponent } from '../../delete-confirmation/delete-confirmation.component';
import { MyStripeService } from 'src/app/service/my-stripe.service';
import { AuthService } from 'src/app/service/auth.service';
import { BankType } from 'src/app/models/bank-type';
import { DateService } from 'src/app/service/date.service';
import { CurrencyService } from 'src/app/service/currency.service';
import { Currency } from 'src/app/models/currency';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'bankaccount-list',
	templateUrl: './bankaccount-list.component.html',
	styleUrls: ['./bankaccount-list.component.scss']
})
export class BankAccountListComponent implements OnInit {
	public bankaccounts: Observable<BankAccount[]>;
	public stripeBankaccounts: Observable<BankAccount[]>;
	public manualBankaccounts: Observable<BankAccount[]>;
	public paypalBankaccounts: Observable<BankAccount[]>;
  public showStripeBankTab: boolean = false;
  public showManulBankTab: boolean = false;
	public message: string;
	public loading: boolean = false;
	public total$: Observable<number>;
	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  accountContextMenu = [
    { title: 'All accounts' },
    { title: 'Stripe accounts' },
    { title: 'Manually added accounts' },
  ];
  showConnectedaccountAlert: boolean = true;
  data: BankAccount [];
  totalBalance:number = 0;
  totalPending:number = 0;
  chartData: any;
  options: any;
  themeSubscription: any;
  currency: Currency;
  @ViewChild('dateRangeInput') dateRangeInput: ElementRef;
  retreivingTransactions : boolean = false;
  stripeBalance: number = 0;
  stripePendingBalance: number = 0;
  paypalBalance: number = 0;
  paypalPendingBalance: number = 0;
  deleteMessage:string;
  errorMessage: string;
  stripeCurrency: string;
  public totalBalanceString: string = "0";
  public pendingBalanceString: string = "0";
  public totalPayPalBalanceString: string = "0";
  public pendingPayPalBalanceString: string = "0";
  public totalStripeBalanceString: string = "0";
  public pendingStripeBalanceString: string = "0";
  lang: string = localStorage.getItem('lang') != null ? localStorage.getItem('lang') : 'en';
  tableActions = [];

	constructor(private bankaccountService : BankAccountService,
    private _dialogService: NbDialogService,
    private authService: AuthService,
    private myStripeService: MyStripeService,
    private translate: TranslateService,
    private toastrService: NbToastrService,
    private currencyService: CurrencyService,
    public _tableService: TableService, private router: Router) {
		this.total$ = _tableService.total$;
		this.searchableColumn();

    // this.tableActions = TABLE_ACTIONS_BANK_ACCOUNTS_LIST[this.lang]
	}

	ngOnInit(): void {
    this.translate.get('general.deletedItem').subscribe(res => this.deleteMessage = res);
    this.translate.get('general.occurredError').subscribe(res => { this.errorMessage = res });
		this.getList();
    this.getCurrency();
	}

	getList() {
		this.loading = true;
    this.paypalBalance = 0;
    this.paypalPendingBalance = 0;
		return this.bankaccountService.getAll().subscribe( result => {
		  this._tableService._search$.next();
		  this._tableService.setEntities(result);
		  this.bankaccounts = this._tableService.entities$;
      this.data = result;
      for(let bank of result)
      {
        console.log(bank)
        if (bank.type === "Stripe")
        {
          this.stripeCurrency = bank.stripeCurrency;
          this.getStripeBalance(bank.stripeAccountId, bank);
        }
        else if (bank.type === "PayPal"){
          this.paypalBalance = this.paypalBalance + bank.balance;
          this.paypalPendingBalance = this.paypalPendingBalance + bank.pendingBalance;

          this.totalPayPalBalanceString = this.paypalBalance.toString();
          if (this.paypalBalance >= 1000) {
            this.totalPayPalBalanceString = (this.paypalBalance / 1000).toFixed(2) + "K";
          }
          if (this.paypalBalance >= 1000000) {
            this.totalPayPalBalanceString = (this.paypalBalance / 1000000).toFixed(2) + "M";
          }
          if (this.paypalBalance >= 1000000000) {
            this.totalPayPalBalanceString = (this.paypalBalance / 1000000000).toFixed(2) + "B";
          }
          if (this.paypalBalance >= 1000000000000) {
            this.totalPayPalBalanceString = (this.paypalBalance / 1000000000000).toFixed(2) + "T";
          }
          console.log(this.totalPayPalBalanceString);

          this.pendingPayPalBalanceString = this.paypalPendingBalance.toString();
          if (this.paypalPendingBalance >= 1000) {
            this.pendingPayPalBalanceString = (this.paypalPendingBalance / 1000).toFixed(2) + "K";
          }
          if (this.paypalPendingBalance >= 1000000) {
            this.pendingPayPalBalanceString = (this.paypalPendingBalance / 1000000).toFixed(2) + "M";
          }
          if (this.paypalPendingBalance >= 1000000000) {
            this.pendingPayPalBalanceString = (this.paypalPendingBalance / 1000000000).toFixed(2) + "B";
          }
          if (this.paypalPendingBalance >= 1000000000000) {
            this.pendingPayPalBalanceString = (this.paypalPendingBalance / 1000000000000).toFixed(2) + "T";
          }
          console.log(this.pendingPayPalBalanceString);
        }
        else
        {
          this.totalBalance = this.totalBalance + bank.balance;
          this.totalPending = this.totalPending + bank.pendingBalance;

          this.totalBalanceString = this.totalBalance.toString();
          if (this.totalBalance >= 1000) {
            this.totalBalanceString = (this.totalBalance / 1000).toFixed(2) + "K";
          }
          if (this.totalBalance >= 1000000) {
            this.totalBalanceString = (this.totalBalance / 1000000).toFixed(2) + "M";
          }
          if (this.totalBalance >= 1000000000) {
            this.totalBalanceString = (this.totalBalance / 1000000000).toFixed(2) + "B";
          }
          if (this.totalBalance >= 1000000000000) {
            this.totalBalanceString = (this.totalBalance / 1000000000000).toFixed(2) + "T";
          }

          this.pendingBalanceString = this.totalPending.toString();
          if (this.totalPending >= 1000) {
            this.pendingBalanceString = (this.totalPending / 1000).toFixed(2) + "K";
          }
          if (this.totalPending >= 1000000) {
            this.pendingBalanceString = (this.totalPending / 1000000).toFixed(2) + "M";
          }
          if (this.totalPending >= 1000000000) {
            this.pendingBalanceString = (this.totalPending / 1000000000).toFixed(2) + "B";
          }
          if (this.totalPending >= 1000000000000) {
            this.pendingBalanceString = (this.totalPending / 1000000000000).toFixed(2) + "T";
          }
        }
      }
      this.loading = false;
		}, (error) => {
		  console.log(error); this.loading = false;
		});
	}

  getCurrency(){
    return this.currencyService.getDefault().subscribe(
      result => {
        this.currency = result;
      }, error => {
        console.log(error);
      }
    )
  }

  getAllAccounts(){
    if(this.data != null){
      this._tableService._search$.next();
		  this._tableService.setEntities(this.data);
		  this.bankaccounts = this._tableService.entities$;
    }
  }

  getStripeAccounts(){
    if(this.data != null){
      this._tableService._search$.next();
		  this._tableService.setEntities(this.data.filter(x => x.type === BankType.Stripe));
		  this.stripeBankaccounts = this._tableService.entities$;
    }
  }

  getManualAccounts(){
    if(this.data != null){
      this._tableService._search$.next();
		  this._tableService.setEntities(this.data.filter(x => x.type === BankType.Manual));
		  this.manualBankaccounts = this._tableService.entities$;
    }
  }

  getPayPalAccounts(){
    if(this.data != null){
      this._tableService._search$.next();
		  this._tableService.setEntities(this.data.filter(x => x.type === BankType.PayPal));
		  this.paypalBankaccounts = this._tableService.entities$;
    }
  }

	delete(id: number){
		return this.bankaccountService.delete(id).subscribe(result => {
		  this.showToast('success',this.deleteMessage);
		  this.getList();
		}, error => {
		  this.showToast('danger',this.errorMessage);
		  console.log(error);
		});
	}

	onSort({column, direction}: SortEvent) {
		this.headers.forEach(header => {
		  if (header.sortable !== column) {
		    header.direction = '';
		  }
		});
		this._tableService.sortColumn = column;
		this._tableService.sortDirection = direction;
	}

	searchableColumn(){
		let attributeTypes: AttributeType[] = [
		  { id: null, name: 'bankName', type: 'string'},
		  { id: null, name: 'bankHolderName', type: 'string'},
		  { id: null, name: 'accountNumber', type: 'string'},
		  { id: null, name: 'balance', type: 'number'},
		  { id: null, name: 'pendingBalance', type: 'number'},
		];
		this._tableService.setAttributesType(attributeTypes);
	}

	showToast(status: NbComponentStatus, message: string) {
	  this.toastrService.show(status, message, { status, duration:4000 });
	}

  showInfiniteToast(status: NbComponentStatus, message: string) {
	  this.toastrService.show(status, message, { status, duration:0 });
	}

  deleteConfirmation(id: number) {
    this._dialogService.open(DeleteConfirmationComponent, { closeOnBackdropClick: false })
      .onClose.subscribe(result => {
        if(result === true){
          this.delete(id);
        }
    });
  }

  closeAlert(){
    this.showConnectedaccountAlert = false
  }

  getStripeBalance(accountId: number, bank:BankAccount){
    var tenantId = this.authService.getCurrentUser().tenantId;
    this.myStripeService.getStripeBalance(tenantId,accountId).subscribe(
      (result) => {
        bank.stripeBalance = result;
        if (result != null){
          if (result.availables != null && result.availables.length > 0){
            this.stripeBalance = result.availables[0].amount;

            this.totalStripeBalanceString = this.stripeBalance.toString();
            if (this.stripeBalance >= 1000) {
              this.totalStripeBalanceString = (this.stripeBalance / 1000).toFixed(2) + "K";
            }
            if (this.stripeBalance >= 1000000) {
              this.totalStripeBalanceString = (this.stripeBalance / 1000000).toFixed(2) + "M";
            }
            if (this.stripeBalance >= 1000000000) {
              this.totalStripeBalanceString = (this.stripeBalance / 1000000000).toFixed(2) + "B";
            }
            if (this.stripeBalance >= 1000000000000) {
              this.totalStripeBalanceString = (this.stripeBalance / 1000000000000).toFixed(2) + "T";
            }
          }
          if(result.pendings != null && result.pendings.length > 0){
            this.stripePendingBalance = result.pendings[0].amount;

            this.pendingStripeBalanceString = this.stripePendingBalance.toString();
            if (this.stripePendingBalance >= 1000) {
              this.pendingStripeBalanceString = (this.stripePendingBalance / 1000).toFixed(2) + "K";
            }
            if (this.stripePendingBalance >= 1000000) {
              this.pendingStripeBalanceString = (this.stripePendingBalance / 1000000).toFixed(2) + "M";
            }
            if (this.stripePendingBalance >= 1000000000) {
              this.pendingStripeBalanceString = (this.stripePendingBalance / 1000000000).toFixed(2) + "B";
            }
            if (this.stripePendingBalance >= 1000000000000) {
              this.pendingStripeBalanceString = (this.stripePendingBalance / 1000000000000).toFixed(2) + "T";
            }
          }
        }
      }, error => {
        console.log(error);
      }
    );
  }

  tabChanged(event: any){
    if (event.tabTitle.toLowerCase() === "all"){
      this.getAllAccounts();
    }else if (event.tabTitle.toLowerCase() === "stripe"){
      this.getStripeAccounts();
    }else if (event.tabTitle.toLowerCase() === "paypal"){
      this.getPayPalAccounts();
    }
    else if (event.tabTitle.toLowerCase() === "manual"){
      this.getManualAccounts();
    }
  }

  // getStripeTransactions(){
  //   this.retreivingTransactions = true;
  //   let startDate =  this.dateService.formatDate(new Date("2021-01-01"));
  //   let endDate = this.dateService.formatDate(new Date());
  //   return this.myStripeService.getStripeBalanceTransaction(startDate, endDate).subscribe(
  //     result => {
  //       this.retreivingTransactions = true;
  //       this.router.navigateByUrl("dashboard/transaction-list");
  //     },error =>{
  //       console.log(error);
  //       this.retreivingTransactions = true;
  //       this.showToast('danger',"An error occur. Please try again...");
  //     }
  //   );
  // }

  openDateRangePicker(){
    this.dateRangeInput.nativeElement.click();
  }

}

