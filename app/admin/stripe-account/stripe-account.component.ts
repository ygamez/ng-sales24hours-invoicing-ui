import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService, NbComponentStatus, NbDialogService } from '@nebular/theme';
import { ServiceService } from 'src/app/service/service.service';
import { Service } from 'src/app/models/service';
import { TableService } from 'src/app/service/table.service';
import { AttributeType } from 'src/app/models/attributeType';
import { NgbdSortableHeader, SortEvent } from 'src/app/directive/sortable.directive';
import { Observable } from 'rxjs';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { MyStripeService } from 'src/app/service/my-stripe.service';

@Component({
  selector: 'app-stripe-account',
  templateUrl: './stripe-account.component.html',
  styleUrls: ['./stripe-account.component.scss']
})
export class StripeAccountComponent implements OnInit {

	public stripeAccounts: any;
	public message: string;
	public loading: boolean = false;
	public total$: Observable<number>;
	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

	constructor(private myStripeService : MyStripeService,
    private _dialogService: NbDialogService,
    private toastrService: NbToastrService, public _tableService: TableService, private router: Router) {
		this.total$ = _tableService.total$;
		this.searchableColumn();
	}

	ngOnInit(): void {
		this.getList();
	}

	getList() {
		this.loading = true;
		return this.myStripeService.getAllStripeAccount().subscribe(result => {
		  this.stripeAccounts = result.data;
		  this.loading = false;
		}, (error) => {
		  console.log(error); this.loading = false;
		});
	}

	delete(accountId: number){
		return this.myStripeService.deleteStripeAccount(accountId).subscribe(result => {
		  this.showToast('success',"The item are succefully deleted from stripe database!");
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
