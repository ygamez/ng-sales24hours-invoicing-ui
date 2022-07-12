import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService, NbComponentStatus, NbDialogService } from '@nebular/theme';
import { ManualJournalService } from 'src/app/service/manualjournal.service';
import { ManualJournal } from 'src/app/models/manualjournal';
import { TableService } from 'src/app/service/table.service';
import { AttributeType } from 'src/app/models/attributeType';
import { NgbdSortableHeader, SortEvent } from 'src/app/directive/sortable.directive';
import { Observable } from 'rxjs';
import { Status } from 'src/app/models/status';
import { DeleteConfirmationComponent } from '../../delete-confirmation/delete-confirmation.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'manualjournal-list',
	templateUrl: './manualjournal-list.component.html',
	styleUrls: ['./manualjournal-list.component.scss']
})
export class ManualJournalListComponent implements OnInit {
	public manualjournals: Observable<ManualJournal[]>;
	public message: string;
	public loading: boolean = false;
	public total$: Observable<number>;
	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  lastManualJournalId:number;
  public errorMessage: string;
  public deletedItem: string;

	constructor(private manualjournalService : ManualJournalService,
    private translate: TranslateService,
    private _dialogService: NbDialogService,
    private toastrService: NbToastrService,
    public _tableService: TableService, private router: Router) {
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
		return this.manualjournalService.getAll().subscribe( result => {
		  this._tableService._search$.next();
      if (result != null){
        this._tableService.setEntities(result);
        this.manualjournals = this._tableService.entities$;
        this.loading = false;
        if (result.length > 0){
          this.lastManualJournalId = result[result.length -1].id;
          this.lastManualJournalId = this.lastManualJournalId + 1;
          result.forEach(x => {
            x.badgeStatus = "badge-dark";
            switch(x.status){
              case Status.Draft:
                x.badgeStatus = "badge-dark";
                break;
              case Status.Approved:
                x.badgeStatus = "badge-warning";
                break;
              case Status.Publish:
                x.badgeStatus  = "badge-success";
                break;
            }
          });
        }
      }

		}, (error) => {
		  console.log(error); this.loading = false;
		});
	}

	delete(id: number){
		return this.manualjournalService.delete(id).subscribe(result => {
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
		  { id: null, name: 'reference', type: 'string'},
		  { id: null, name: 'status', type: 'string'},
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
