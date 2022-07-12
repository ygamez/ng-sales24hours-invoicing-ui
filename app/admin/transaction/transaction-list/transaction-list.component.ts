import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService, NbComponentStatus, NbDialogService } from '@nebular/theme';
import { TransactionService } from 'src/app/service/transaction.service';
import { Transaction } from 'src/app/models/transaction';
import { TableService } from 'src/app/service/table.service';
import { AttributeType } from 'src/app/models/attributeType';
import { NgbdSortableHeader, SortEvent } from 'src/app/directive/sortable.directive';
import { Observable } from 'rxjs';
import { DeleteConfirmationComponent } from '../../delete-confirmation/delete-confirmation.component';
import { CurrencyService } from 'src/app/service/currency.service';
import { Currency } from 'src/app/models/currency';
import { DateService } from 'src/app/service/date.service';
import { MyStripeService } from 'src/app/service/my-stripe.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'transaction-list',
	templateUrl: './transaction-list.component.html',
	styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit, OnDestroy {
	public transactions: Observable<Transaction[]>;
	public message: string;
	public loading: boolean = false;
	public total$: Observable<number>;
	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  currency: Currency;
  retreivingTransactions : boolean = false;
  categoryBadge: string = 'badge-info';
  errorMessage: string;
  deletedItem: string;

	constructor(private transactionService : TransactionService,
    private translate: TranslateService,
    private _dialogService: NbDialogService,
    private toastrService: NbToastrService,
    public _tableService: TableService,
    private dateService: DateService,
    private myStripeService: MyStripeService,
    private router: Router,
    private currencyService: CurrencyService) {
		this.total$ = _tableService.total$;
		this.searchableColumn();
    this._tableService._search$.next();
    this._tableService.setEntities([]);
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
		this.getList();
    this.getDefaultCurrency();
	}

  ngOnDestroy(): void {
    this._tableService._search$.next();
    this._tableService.setEntities([]);
  }


	getList() {
		this.loading = true;
		return this.transactionService.getAll().subscribe( result => {
      result.forEach(x => {
        x.accountBalanceName = x.accountBalance?.accountName;
        x.accountName = x.account?.accountName;
      });
		  this._tableService._search$.next();
		  this._tableService.setEntities(result.filter(x => x.published));
		  this.transactions = this._tableService.entities$;
		  if (result.length == 0) this.message = "There is no data at this time...";
		  this.loading = false;
		}, (error) => {
		  console.log(error); this.loading = false;
		});
	}

	delete(id: number){
		return this.transactionService.delete(id).subscribe(result => {
		  this.showToast('success', this.deletedItem);
		  this.getList();
		}, error => {
		  this.showToast('danger', this.errorMessage);
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
		  { id: null, name: 'date ', type: 'string'},
		  { id: null, name: 'accountBalanceName ', type: 'string'},
		  { id: null, name: 'accountName ', type: 'string'},
		  { id: null, name: 'category ', type: 'string'},
		  { id: null, name: 'platform ', type: 'string'},
		  { id: null, name: 'totalTax ', type: 'number'},
		  { id: null, name: 'amount', type: 'number'},
		  { id: null, name: 'note', type: 'string'},
		];
		this._tableService.setAttributesType(attributeTypes);
	}

	showToast(status: NbComponentStatus, message: string) {
	  this.toastrService.show(status, message, { status, duration:4000 });
	}

  deleteConfirmation(id: number) {
    this._dialogService.open(DeleteConfirmationComponent, { closeOnBackdropClick: false })
      .onClose.subscribe(result => {
        if(result === true){
          this.delete(id);
        }
    });
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

  getStripeTransactions(){
    this.retreivingTransactions = true;
    let startDate =  this.dateService.formatDate(new Date("2021-01-01"));
    let endDate = this.dateService.formatDate(new Date());
    return this.myStripeService.getStripeBalanceTransaction(startDate, endDate).subscribe(
      result => {
        this.retreivingTransactions = true;
        this.router.navigateByUrl("dashboard/transaction-list");
      },error =>{
        console.log(error);
        this.retreivingTransactions = true;
        this.showToast('danger', this.errorMessage);
      }
    );
  }
}
