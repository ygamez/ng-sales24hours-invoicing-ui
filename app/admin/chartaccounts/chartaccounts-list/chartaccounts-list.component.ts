
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService, NbComponentStatus, NbDialogService } from '@nebular/theme';
import { ChartAccountsService } from 'src/app/service/chartaccounts.service';
import { ChartAccounts } from 'src/app/models/chartaccounts';
import { TableService } from 'src/app/service/table.service';
import { AttributeType } from 'src/app/models/attributeType';
import { NgbdSortableHeader, SortEvent } from 'src/app/directive/sortable.directive';
import { Observable } from 'rxjs';
import { DeleteConfirmationComponent } from '../../delete-confirmation/delete-confirmation.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'chartaccounts-list',
	templateUrl: './chartaccounts-list.component.html',
	styleUrls: ['./chartaccounts-list.component.scss']
})
export class ChartAccountsListComponent implements OnInit {
	public data: ChartAccounts[];
	public chartaccounts: Observable<ChartAccounts[]>;
	public assetsAccount: Observable<ChartAccounts[]>;
	public liabilityAccounts: Observable<ChartAccounts[]>;
	public incomeAccounts: Observable<ChartAccounts[]>;
	public expensesAccounts: Observable<ChartAccounts[]>;
	public equityAccounts: Observable<ChartAccounts[]>;
	public message: string;
	public loading: boolean = false;
	public total$: Observable<number>;
	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  errorMessage: string;
  deletedItem: string;


	constructor(private chartaccountService : ChartAccountsService,
    private _dialogService: NbDialogService,
    private toastrService: NbToastrService,
    public _tableService: TableService,
    public translate: TranslateService,
    private router: Router) {
		this.total$ = _tableService.total$;
		this.searchableColumn();
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => { this.deletedItem = res });
		this.getList();
	}

	getList() {
		this.loading = true;
		return this.chartaccountService.getAll().subscribe( result => {
      result.forEach(x => x.accountTypeName = x.accountType.name);
		  this._tableService._search$.next();
		  this._tableService.setEntities(result);
		  this.chartaccounts = this._tableService.entities$;
		  this.data = result;
		  if (result.length == 0) this.message = "There is no data at this time...";
		  this.loading = false;
		}, (error) => {
		  console.log(error); this.loading = false;
		});
	}

  getAllAccounts(){
    if(this.data != null){
      this._tableService._search$.next();
		  this._tableService.setEntities(this.data);
		  this.chartaccounts = this._tableService.entities$;
    }
  }

  getAssetsAccounts(){
    if(this.data != null){
      this._tableService._search$.next();
		  this._tableService.setEntities(this.data.filter(x => x.accountType.accountTypeCategory.name === "Assets"));
		  this.assetsAccount = this._tableService.entities$;
    }
  }

  getLiabilitiesAccounts(){
    if(this.data != null){
      this._tableService._search$.next();
		  this._tableService.setEntities(this.data.filter(x => x.accountType.accountTypeCategory.name.toLowerCase() === "liabilities & credit cards"));
		  this.liabilityAccounts = this._tableService.entities$;
    }
  }

  getIncomeAccounts(){
    if(this.data != null){
      this._tableService._search$.next();
		  this._tableService.setEntities(this.data.filter(x => x.accountType.accountTypeCategory.name === "Income"));
		  this.incomeAccounts = this._tableService.entities$;
    }
  }

  getExpensesAccounts(){
    if(this.data != null){
      this._tableService._search$.next();
		  this._tableService.setEntities(this.data.filter(x => x.accountType.accountTypeCategory.name === "Expenses"));
		  this.expensesAccounts = this._tableService.entities$;
    }
  }

  getEquityAccounts(){
    if(this.data != null){
      this._tableService._search$.next();
		  this._tableService.setEntities(this.data.filter(x => x.accountType.accountTypeCategory.name === "Equity"));
		  this.equityAccounts = this._tableService.entities$;
    }
  }

	delete(id: number){
		return this.chartaccountService.delete(id).subscribe(result => {
		  this.showToast('success',this.deletedItem);
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
		  { id: null, name: 'accountTypeName', type: 'string'},
		  { id: null, name: 'accountId', type: 'string'},
		  { id: null, name: 'accountName', type: 'string'},
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

  tabChanged(event: any){
    if (event.tabTitle.toLowerCase() === "all accounts"){
      this.getAllAccounts();
    }
    else if (event.tabTitle.toLowerCase() === "assets"){
      this.getAssetsAccounts();
    }
    else if (event.tabTitle.toLowerCase() === "liabilities & credit cards"){
      this.getLiabilitiesAccounts()
    }
    else if (event.tabTitle.toLowerCase() === "income"){
      this.getIncomeAccounts();
    }
    else if (event.tabTitle.toLowerCase() === "expenses"){
      this.getExpensesAccounts();
    }
    else if (event.tabTitle.toLowerCase() === "equity"){
      this.getEquityAccounts();
    }
  }
}
