
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService, NbComponentStatus, NbDialogService } from '@nebular/theme';
import { AssetsService } from 'src/app/service/assets.service';
import { Assets } from 'src/app/models/assets';
import { TableService } from 'src/app/service/table.service';
import { AttributeType } from 'src/app/models/attributeType';
import { NgbdSortableHeader, SortEvent } from 'src/app/directive/sortable.directive';
import { Observable } from 'rxjs';
import { DeleteConfirmationComponent } from '../../delete-confirmation/delete-confirmation.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'assets-list',
	templateUrl: './assets-list.component.html',
	styleUrls: ['./assets-list.component.scss']
})
export class AssetsListComponent implements OnInit {
	public assets: Observable<Assets[]>;
	public message: string;
	public loading: boolean = false;
	public total$: Observable<number>;
	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  occurredError: string;
  deletedItem: string;

	constructor(private assetsService : AssetsService,
    private translate: TranslateService,
    private _dialogService: NbDialogService,
    private toastrService: NbToastrService, public _tableService: TableService, private router: Router) {
		this.total$ = _tableService.total$;
		this.searchableColumn();
    this._tableService._search$.next();
    this._tableService.setEntities([]);
	}

	ngOnInit(): void {
		this.getList();
    this.translate.get('general.occurredError').subscribe(res => { this.occurredError = res });
    this.translate.get('general.deletedItem').subscribe(res => { this.deletedItem = res });
	}

	getList() {
		this.loading = true;
		return this.assetsService.getAll().subscribe( result => {
		  this._tableService._search$.next();
		  this._tableService.setEntities(result);
		  this.assets = this._tableService.entities$;
		  if (result.length == 0) this.message = "";
		  this.loading = false;
		}, (error) => {
		  console.log(error); this.loading = false;
		});
	}

	delete(id: number){
		return this.assetsService.delete(id).subscribe(result => {
		  this.showToast('success', this.deletedItem);
		  this.getList();
		}, error => {
		  this.showToast('danger', this.occurredError);
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
		  { id: null, name: 'amount', type: 'number'},
		  { id: null, name: 'purchaseDate', type: 'string'},
		  { id: null, name: 'supportedDate', type: 'string'},
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
