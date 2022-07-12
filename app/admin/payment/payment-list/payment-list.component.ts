
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService, NbComponentStatus, NbDialogService } from '@nebular/theme';
import { PaymentService } from 'src/app/service/payment.service';
import { Payment } from 'src/app/models/payment';
import { TableService } from 'src/app/service/table.service';
import { AttributeType } from 'src/app/models/attributeType';
import { NgbdSortableHeader, SortEvent } from 'src/app/directive/sortable.directive';
import { Observable } from 'rxjs';
import { DeleteConfirmationComponent } from '../../delete-confirmation/delete-confirmation.component';
import { Currency } from 'src/app/models/currency';
import { CurrencyService } from 'src/app/service/currency.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'payment-list',
	templateUrl: './payment-list.component.html',
	styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent implements OnInit {
	public payments: Observable<Payment[]>;
	public message: string;
	public loading: boolean = false;
	public total$: Observable<number>;
	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  public currency: Currency;
  public errorMessage: string;
  public deletedItem: string;

	constructor(private paymentService : PaymentService,
    private translate: TranslateService,
    private _dialogService: NbDialogService,
    private toastrService: NbToastrService,
    public _tableService: TableService,
    private currencyService: CurrencyService) {
		this.total$ = _tableService.total$;
		this.searchableColumn();
	}

	ngOnInit(): void {
		this.getList();
    this.getDefaultCurrency();
	}

	getList() {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
		this.loading = true;
		return this.paymentService.getAll().subscribe( result => {
      result.forEach(item => {
        item.vendorName = item.vendor?.name;
        item.vendorEmail = item.vendor?.email;
        item.bankAccountName = item.bankAccount?.bankName;
        item.accountName = item.account?.accountName;
        item.accountBalanceName = item.accountBalance?.accountName;
        item.billReference = item.bill?.reference;
      });

		  this._tableService._search$.next();
		  this._tableService.setEntities(result);
		  this.payments = this._tableService.entities$;
		  if (result.length == 0) this.message = "There is no data at this time...";
		  this.loading = false;
		}, (error) => {
		  console.log(error); this.loading = false;
		});
	}

	delete(id: number){
		return this.paymentService.delete(id).subscribe(result => {
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
		  { id: null, name: 'vendorName', type: 'string'},
		  { id: null, name: 'vendorEmail', type: 'string'},
		  { id: null, name: 'bankAccountName', type: 'string'},
		  { id: null, name: 'accountName', type: 'string'},
		  { id: null, name: 'accountBalanceName', type: 'string'},
		  { id: null, name: 'billReference', type: 'string'},
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
