
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService, NbComponentStatus, NbDialogService } from '@nebular/theme';
import { TaxeService } from 'src/app/service/taxe.service';
import { Taxe } from 'src/app/models/taxe';
import { TableService } from 'src/app/service/table.service';
import { AttributeType } from 'src/app/models/attributeType';
import { NgbdSortableHeader, SortEvent } from 'src/app/directive/sortable.directive';
import { Observable } from 'rxjs';
import { DeleteConfirmationComponent } from '../../delete-confirmation/delete-confirmation.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'taxe-list',
	templateUrl: './taxe-list.component.html',
	styleUrls: ['./taxe-list.component.scss']
})
export class TaxeListComponent implements OnInit {
	public taxes: Observable<Taxe[]>;
	public message: string;
	public loading: boolean = false;
	public total$: Observable<number>;
	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  parentRoute: string;
  errorMessage: string;
  deletedItem: string;

	constructor(private taxeService : TaxeService,
    private translate: TranslateService,
    private _dialogService: NbDialogService,
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
		return this.taxeService.getAll().subscribe( result => {
		  this._tableService._search$.next();
		  this._tableService.setEntities(result.filter(x=> x.type === this.parentRoute));
		  this.taxes = this._tableService.entities$;
		  this.loading = false;
		}, (error) => {
		  console.log(error); this.loading = false;
		});
	}

	delete(id: number){
		return this.taxeService.delete(id).subscribe(result => {
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
		  { id: null, name: 'name', type: 'string'},
		  { id: null, name: 'rate', type: 'number'},
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
