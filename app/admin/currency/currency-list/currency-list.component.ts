import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbComponentStatus, NbDialogService } from '@nebular/theme';
import { CurrencyService } from 'src/app/service/currency.service';
import { Currency } from 'src/app/models/currency';
import { TableService } from 'src/app/service/table.service';
import { AttributeType } from 'src/app/models/attributeType';
import { NgbdSortableHeader, SortEvent } from 'src/app/directive/sortable.directive';
import { Observable } from 'rxjs';
import { DeleteConfirmationComponent } from '../../delete-confirmation/delete-confirmation.component';
import { AuthService } from 'src/app/service/auth.service';
import { SettingService } from 'src/app/service/setting.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'currency-list',
	templateUrl: './currency-list.component.html',
	styleUrls: ['./currency-list.component.scss']
})
export class CurrencyListComponent implements OnInit {
	public currencies: Currency[];
	public message: string;
	public loading: boolean = false;
	public total$: Observable<number>;
	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  userRole: string = this.authService.getCurrentUser().role.name;
  parentRoute: string;
  errorMessage: string;
  deletedItem: string;

	constructor(private currencyService : CurrencyService,
    private translate: TranslateService,
    private settingService: SettingService,
    private _dialogService: NbDialogService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private toastrService: NbToastrService, public _tableService: TableService, private router: Router) {
		this.total$ = _tableService.total$;
		this.searchableColumn();
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentRoute = urlPath[urlPath.length - 1].path;
    });
    this.getList();
	}

	getList() {
		this.loading = true;
		return this.currencyService.getAll().subscribe( result => {
      this.currencies = result.filter(x => x.userRole === this.parentRoute);
		  this.loading = false;
		}, (error) => {
		  console.log(error); this.loading = false;
		});
	}

	delete(id: number){
		return this.currencyService.delete(id).subscribe(result => {
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
		  { id: null, name: 'name', type: 'string'},
		  { id: null, name: 'symbol', type: 'string'},
		  { id: null, name: 'isoCode', type: 'string'},
		  { id: null, name: 'active', type: 'boolean'},
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



}
