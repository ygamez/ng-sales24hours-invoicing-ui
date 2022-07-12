import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NbToastrService, NbComponentStatus, NbDialogService } from '@nebular/theme';
import { CreditNoteService } from 'src/app/service/creditnote.service';
import { CreditNote } from 'src/app/models/creditnote';
import { TableService } from 'src/app/service/table.service';
import { AttributeType } from 'src/app/models/attributeType';
import { NgbdSortableHeader, SortEvent } from 'src/app/directive/sortable.directive';
import { Observable } from 'rxjs';
import { DeleteConfirmationComponent } from '../../delete-confirmation/delete-confirmation.component';
import { Currency } from 'src/app/models/currency';
import { CurrencyService } from 'src/app/service/currency.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'creditnote-list',
	templateUrl: './creditnote-list.component.html',
	styleUrls: ['./creditnote-list.component.scss']
})
export class CreditNoteListComponent implements OnInit {
  public creditnotes: Observable<CreditNote[]>;
	public message: string;
	public loading: boolean = false;
	public total$: Observable<number>;
	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  public currency: Currency;
  public errorMessage: string;
  public deletedItem: string;

	constructor(private creditnoteService : CreditNoteService,
    private translate: TranslateService,
    private _dialogService: NbDialogService,
    private toastrService: NbToastrService,
    public _tableService: TableService,
    private currencyService: CurrencyService) {
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
		return this.creditnoteService.getAll().subscribe( result => {
      result.forEach(x =>{
        x.invoiceReference = x.invoice?.reference;
      });
		  this._tableService._search$.next();
		  this._tableService.setEntities(result);
		  this.creditnotes = this._tableService.entities$;
		  if (result.length == 0) this.message = "There is no data at this time...";
		  this.loading = false;
		}, (error) => {
		  console.log(error); this.loading = false;
		});
	}

	delete(id: number){
		return this.creditnoteService.delete(id).subscribe(result => {
		  this.showToast('success',this.deletedItem);
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
		  { id: null, name: 'invoiceReference', type: 'string'},
		  { id: null, name: 'amount', type: 'number'},
		  { id: null, name: 'date', type: 'string'},
		  { id: null, name: 'description', type: 'string'},
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
