import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService, NbComponentStatus } from '@nebular/theme';
import { TransferService } from 'src/app/service/transfer.service';
import { Transfer } from 'src/app/models/transfer';
import { TableService } from 'src/app/service/table.service';
import { AttributeType } from 'src/app/models/attributeType';
import { NgbdSortableHeader, SortEvent } from 'src/app/directive/sortable.directive';
import { Observable } from 'rxjs';

@Component({
	selector: 'transfer-list',
	templateUrl: './transfer-list.component.html',
	styleUrls: ['./transfer-list.component.scss']
})
export class TransferListComponent implements OnInit {
	public transfers: Observable<Transfer[]>;
	public message: string;
	public loading: boolean = false;
	public total$: Observable<number>;
	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

	constructor(private transferService : TransferService, private toastrService: NbToastrService, public _tableService: TableService, private router: Router) {
		this.total$ = _tableService.total$;
		this.searchableColumn();
	}

	ngOnInit(): void {
		this.getList();
	}

	getList() {
		this.loading = true;
		return this.transferService.getAll().subscribe( result => {
		  this._tableService._search$.next();
		  this._tableService.setEntities(result);
		  this.transfers = this._tableService.entities$;
		  if (result.length == 0) this.message = "There is no data at this time...";
		  this.loading = false;
		}, (error) => {
		  console.log(error); this.loading = false;
		});
	}

	delete(id: number){
		return this.transferService.delete(id).subscribe(result => {
		  this.showToast('success',"The item are succefully deleted!");
		  this.getList();
		}, error => {
		  this.showToast('danger',"An error occur. Please try again...");
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
		  { id: null, name: 'fromBankAccount', type: 'string'},
		  { id: null, name: 'toBankAccount', type: 'string'},
		  { id: null, name: 'amount', type: 'number'},
		  { id: null, name: 'date', type: 'string'},
		  { id: null, name: 'reference', type: 'string'},
		  { id: null, name: 'description', type: 'string'},
		];
		this._tableService.setAttributesType(attributeTypes);
	}

	showToast(status: NbComponentStatus, message: string) {
	  this.toastrService.show(status, message, { status, duration:4000 });
	}

}
