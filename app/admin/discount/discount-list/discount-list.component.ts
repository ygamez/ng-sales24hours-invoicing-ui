import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService, NbComponentStatus } from '@nebular/theme';
import { DiscountService } from 'src/app/service/discount.service';
import { Discount } from 'src/app/models/discount';
import { TableService } from 'src/app/service/table.service';
import { AttributeType } from 'src/app/models/attributeType';
import { NgbdSortableHeader, SortEvent } from 'src/app/directive/sortable.directive';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'discount-list',
	templateUrl: './discount-list.component.html',
	styleUrls: ['./discount-list.component.scss']
})
export class DiscountListComponent implements OnInit {
	public discounts: Observable<Discount[]>;
	public message: string;
	public loading: boolean = false;
	public total$: Observable<number>;
	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  errorMessage: string;
  deletedItem: string;

	constructor(private discountService : DiscountService,
    private translate: TranslateService,
    private toastrService: NbToastrService,
    public _tableService: TableService,

    private router: Router) {
		this.total$ = _tableService.total$;
		this.searchableColumn();
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
		this.getList();
	}

	getList() {
		this.loading = true;
		return this.discountService.getAll().subscribe( result => {
		  this._tableService._search$.next();
		  this._tableService.setEntities(result);
		  this.discounts = this._tableService.entities$;
		  if (result.length == 0) this.message = "There is no data at this time...";
		  this.loading = false;
		}, (error) => {
		  console.log(error); this.loading = false;
		});
	}

	delete(id: number){
		return this.discountService.delete(id).subscribe(result => {
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
		  // { id: null, name: 'plan', type: 'string'},
		  { id: null, name: 'code', type: 'string'},
		  { id: null, name: 'value', type: 'string'},
		  { id: null, name: 'quantity', type: 'string'},
		];
		this._tableService.setAttributesType(attributeTypes);
	}

	showToast(status: NbComponentStatus, message: string) {
	  this.toastrService.show(status, message, { status, duration:4000 });
	}

}
