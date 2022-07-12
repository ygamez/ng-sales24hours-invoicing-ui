import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService, NbComponentStatus, NbDialogService } from '@nebular/theme';
import { BillService } from 'src/app/service/bill.service';
import { Bill } from 'src/app/models/bill';
import { TableService } from 'src/app/service/table.service';
import { AttributeType } from 'src/app/models/attributeType';
import { NgbdSortableHeader, SortEvent } from 'src/app/directive/sortable.directive';
import { Observable } from 'rxjs';
import { DeleteConfirmationComponent } from '../../delete-confirmation/delete-confirmation.component';
import { AuthService } from 'src/app/service/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'bill-list',
	templateUrl: './bill-list.component.html',
	styleUrls: ['./bill-list.component.scss']
})
export class BillListComponent implements OnInit {
	public bills: Observable<Bill[]>;
	public message: string;
	public loading: boolean = false;
	public total$: Observable<number>;
	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  public lastBillId: number = 0;
  errorMessage: string;
  noAdminRights: string;
  emailIsSent: string;
  deletedItem: string;
  validateProcess: string;

	constructor(private billService : BillService,
    private _dialogService: NbDialogService,
    private translate: TranslateService,
    private toastrService: NbToastrService,
    public _tableService: TableService,
    private _authService: AuthService,
    private router: Router) {
		this.total$ = _tableService.total$;
		this.searchableColumn();
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
    this.translate.get('general.noAdminRights').subscribe(res => this.noAdminRights = res);
    this.translate.get('general.emailIsSent').subscribe(res => this.emailIsSent = res);
    this.translate.get('general.validateProcess').subscribe(res => this.validateProcess = res);
		this.getList();
	}

	getList() {
		this.loading = true;
		return this.billService.getAll().subscribe( result => {
      if (result != null){
        result.forEach(x => {
          x.dueDateIsPassed = false;
          x.vendorName = x.vendor.name;
          x.vendorEmail = x.vendor.email;
          if (new Date(x.issueDate) < new Date()){
            x.dueDateIsPassed = true;
          }
        })
		    this._tableService._search$.next();
        this._tableService.setEntities(result);
        this.bills = this._tableService.entities$;
        this.loading = false;
        this.lastBillId = result[result.length -1].id;
        this.lastBillId = this.lastBillId + 1;
      }
		}, (error) => {
		  console.log(error); this.loading = false;
		});
	}

	delete(id: number){
		return this.billService.delete(id).subscribe(result => {
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
		  { id: null, name: 'reference', type: 'string'},
		  { id: null, name: 'issueDate', type: 'string'},
		  { id: null, name: 'totalAmount', type: 'number'},
		  { id: null, name: 'vendorName', type: 'string'},
		  { id: null, name: 'vendorEmail', type: 'string'},
		  { id: null, name: 'status', type: 'string'},
		];
		this._tableService.setAttributesType(attributeTypes);
	}

	showToast(status: NbComponentStatus, message: string) {
	  this.toastrService.show(status, message, { status, duration:4000 });
	}


  resend(bill:Bill){
    if(this._authService.getCurrentUser().role.name != "Viewer"){
      if (['Sent','Paid', 'Partially paid'].includes(bill.status)){
        return this.billService.resend(bill).subscribe(
          () => {
            this.showToast("success",this.emailIsSent);
          },error => {
            console.log(error);
            this.showToast("danger",this.errorMessage)
          }
        );
      }else {
        this.showToast('warning',this.validateProcess)
      }
    }
    else
    {
      this.showToast("warning",this.noAdminRights);
    }
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
