import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService, NbComponentStatus, NbDialogService } from '@nebular/theme';
import { CustomerService } from 'src/app/service/customer.service';
import { Customer } from 'src/app/models/customer';
import { TableService } from 'src/app/service/table.service';
import { AttributeType } from 'src/app/models/attributeType';
import { NgbdSortableHeader, SortEvent } from 'src/app/directive/sortable.directive';
import { Observable } from 'rxjs';
import { DeleteConfirmationComponent } from '../../delete-confirmation/delete-confirmation.component';
import { SubscriptionService } from 'src/app/service/subscription.service';
import { AuthService } from 'src/app/service/auth.service';
import { Subscription } from 'src/app/models/subscription';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'customer-list',
	templateUrl: './customer-list.component.html',
	styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements OnInit {
	public customers: Observable<Customer[]>;
	public message: string;
	public loading: boolean = false;
	public total$: Observable<number>;
	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  public subscription: Subscription;
  public subscriptionPercentLimit: number;
  public totalCustomer: number;
  public errorMessage: string;
  public deletedItem: string;
  public customerCreateLimit: string;

	constructor(private customerService : CustomerService,
    private translate: TranslateService,
    private _dialogService: NbDialogService,
    private toastrService: NbToastrService,
    public _tableService: TableService,
    private subscriptionService: SubscriptionService,
    private authService: AuthService,
    private router: Router) {
		this.total$ = _tableService.total$;
		this.searchableColumn();
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
    this.translate.get('general.customerCreateLimit').subscribe(res => this.customerCreateLimit = res);
		this.getList();
	}

	getList() {
		this.loading = true;
		return this.customerService.getAll().subscribe( result => {
      this.totalCustomer = result?.length;
		  this._tableService._search$.next();
		  this._tableService.setEntities(result);
		  this.customers = this._tableService.entities$;
		  if (result.length == 0) this.message = "There is no data at this time...";
		  this.loading = false;
      this.getSubscription();
		}, (error) => {
		  console.log(error); this.loading = false;
		});
	}

	delete(id: number){
		return this.customerService.delete(id).subscribe(result => {
		  this.showToast('success',this.deletedItem,5000);
		  this.getList();
		}, error => {
		  this.showToast('danger',this.errorMessage,5000);
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
		  { id: null, name: 'email', type: 'string'},
		  { id: null, name: 'name', type: 'string'},
		  { id: null, name: 'email', type: 'string'},
		  { id: null, name: 'phone', type: 'string'},
		  { id: null, name: 'password', type: 'string'},
		];
		this._tableService.setAttributesType(attributeTypes);
	}

  showToast(status: NbComponentStatus, message: string, duration: number) {
	  this.toastrService.show(status, message, { status, duration:duration });
	}

  deleteConfirmation(id: number) {
    this._dialogService.open(DeleteConfirmationComponent, { closeOnBackdropClick: false })
      .onClose.subscribe(result => {
        if(result === true){
          this.delete(id);
        }
    });
  }

  getSubscription(){
    return this.subscriptionService.getTenantSubscription(this.authService.getCurrentUser().tenantId).subscribe(
      (result) => {
        this.subscription = result;
        if(result != null && result.plan){
          if (result.plan.maxCustomer <= -1){
            this.subscriptionPercentLimit = 0;
          }else{
            this.subscriptionPercentLimit = (this.totalCustomer / result.plan.maxCustomer) * 100;
          }
        }
      }
    );
  }



  redirectToCustomerCreateComponent(){
    if (this.subscription != null && this.subscription.canCreateCustomer){
      this.router.navigateByUrl('/dashboard/customer/create')
    }else{
      this.showToast("warning", this.customerCreateLimit,0)
    }
  }
}
