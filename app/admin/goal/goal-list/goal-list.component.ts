
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService, NbComponentStatus, NbDialogService } from '@nebular/theme';
import { GoalService } from 'src/app/service/goal.service';
import { Goal } from 'src/app/models/goal';
import { TableService } from 'src/app/service/table.service';
import { AttributeType } from 'src/app/models/attributeType';
import { NgbdSortableHeader, SortEvent } from 'src/app/directive/sortable.directive';
import { Observable } from 'rxjs';
import { DeleteConfirmationComponent } from '../../delete-confirmation/delete-confirmation.component';
import { RevenueService } from 'src/app/service/revenue.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'goal-list',
	templateUrl: './goal-list.component.html',
	styleUrls: ['./goal-list.component.scss']
})
export class GoalListComponent implements OnInit {
	public goals: Goal[];
	public message: string;
	public loading: boolean = false;
	public total$: Observable<number>;
	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  public totalIcome;
  errorMessage: string;
  deletedItem: string;

	constructor(private goalService : GoalService,
    private _dialogService: NbDialogService,
    private revenueService: RevenueService,
    private toastrService: NbToastrService,
    public _tableService: TableService,
    private translate: TranslateService,
    private router: Router) {
		this.total$ = _tableService.total$;
		this.searchableColumn();
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
		this.getList();
    this.revenueService.getTotalIcome().subscribe(
      () =>{},
      error => console.log(error),
    );
	}

	getList() {
    return this.revenueService.getTotalIcome().subscribe(result => {
		  this.totalIcome = result;
      this.goalService.getAll().subscribe( result => {
        this.goals = result;
        for(let item of result){
          item.value = 0;
          if (this.totalIcome != null && this.totalIcome > 0){
            item.value = (this.totalIcome * 100) / item.amount;
            if (item.value > 100) item.value = 100;
          }
          if (item.value <= 25){
            item.status = "danger";
          }else if (item.value <= 50){
            item.status = "warning";
          }else if (item.value <= 75){
            item.status = "primary"
          }else if(item.value <= 100){
            item.status = "success";
          }
        }
      }, (error) => {
        console.log(error);
      });
		}, (error) => {
		  console.log(error);
		});

	}

	delete(id: number){
		return this.goalService.delete(id).subscribe(result => {
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
		  { id: null, name: 'amount', type: 'number'},
		  { id: null, name: 'type', type: 'string'},
		  { id: null, name: 'from', type: 'string'},
		  { id: null, name: 'to', type: 'string'},
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
