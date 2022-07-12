import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService, NbComponentStatus, NbDialogService } from '@nebular/theme';
import { RevenueService } from 'src/app/service/revenue.service';
import { Revenue } from 'src/app/models/revenue';
import { TableService } from 'src/app/service/table.service';
import { AttributeType } from 'src/app/models/attributeType';
import { NgbdSortableHeader, SortEvent } from 'src/app/directive/sortable.directive';
import { Observable } from 'rxjs';
import { DeleteConfirmationComponent } from '../../delete-confirmation/delete-confirmation.component';
import { CurrencyService } from 'src/app/service/currency.service';
import { Currency } from 'src/app/models/currency';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'revenue-list',
	templateUrl: './revenue-list.component.html',
	styleUrls: ['./revenue-list.component.scss']
})
export class RevenueListComponent implements OnInit {
	public revenues: Observable<Revenue[]>;
	public message: string;
	public loading: boolean = false;
	public total$: Observable<number>;
	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  public totalIcome: number = 0;
  public currency: Currency;
  errorMessage: string;
  deletedItem: string;

	constructor(private revenueService : RevenueService,
    private translate: TranslateService,
    private toastrService: NbToastrService,
    private _dialogService: NbDialogService,
    public _tableService: TableService,
    private currencyService: CurrencyService,
    private router: Router) {
		this.total$ = _tableService.total$;
		this.searchableColumn();
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
		this.getList();
    this.getDefaultCurrency();
	}

	getList() {
		this.loading = true;
		return this.revenueService.getAll().subscribe( result => {
      result.forEach(item => {
        this.totalIcome = this.totalIcome + item.amount;
        item.customerName = item.customer.name;
        item.customerEmail = item.customer.email;
        item.bankAccountName = item.bankAccount.bankName;
        item.accountName = item.account?.accountName;
        item.accountBalanceName = item.accountBalance?.accountName;
        item.invoiceReference = item.invoice?.reference;
      });
		  this._tableService._search$.next();
		  this._tableService.setEntities(result);
		  this.revenues = this._tableService.entities$;
		  this.loading = false;

		}, (error) => {
		  console.log(error); this.loading = false;
		});
	}

	delete(id: number){
		return this.revenueService.delete(id).subscribe(result => {
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
		  { id: null, name: 'date', type: 'string'},
		  { id: null, name: 'amount', type: 'number'},
		  { id: null, name: 'totalTax', type: 'number'},
		  { id: null, name: 'customerName', type: 'string'},
		  { id: null, name: 'customerEmail', type: 'string'},
		  { id: null, name: 'bankAccountName', type: 'string'},
		  { id: null, name: 'accountName', type: 'string'},
		  { id: null, name: 'accountBalanceName', type: 'string'},
		  { id: null, name: 'invoiceReference', type: 'string'},
		  { id: null, name: 'paymentMethod', type: 'string'}
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

}
