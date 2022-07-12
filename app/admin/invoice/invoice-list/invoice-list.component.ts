import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService, NbComponentStatus, NbDialogService } from '@nebular/theme';
import { InvoiceService } from 'src/app/service/invoice.service';
import { Invoice } from 'src/app/models/invoice';
import { TableService } from 'src/app/service/table.service';
import { AttributeType } from 'src/app/models/attributeType';
import { NgbdSortableHeader, SortEvent } from 'src/app/directive/sortable.directive';
import { Observable } from 'rxjs';
import { Status } from 'src/app/models/status';
import { DeleteConfirmationComponent } from '../../delete-confirmation/delete-confirmation.component';
import { SubscriptionService } from 'src/app/service/subscription.service';
import { Subscription } from 'src/app/models/subscription';
import { AuthService } from 'src/app/service/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'invoice-list',
	templateUrl: './invoice-list.component.html',
	styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {
	public invoices: Observable<Invoice[]>;
  public invoicesData: Invoice[];
	public message: string;
	public loading: boolean = false;
	public total$: Observable<number>;
	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  public lastInvoiceId: number = 0;
  public subscription: Subscription;
  public canCreateInvoice: boolean = true;
  public subscriptionPercentLimit : number = 0;
  public totalInvoice: number;
  validateProcess: string;
  errorMessage: string;
  invoiceApproveSuccess: string;
  invoiceStatusChangeSuccess: string;
  noAdminRights: string;
  emailIsSent: string;
  deletedItem: string;
  invoiceLimit: string;

	constructor(private invoiceService : InvoiceService,
    private translate: TranslateService,
    private toastrService: NbToastrService,
    public _tableService: TableService,
    private _dialogService: NbDialogService,
    private subscriptionService: SubscriptionService,
    private _authService: AuthService,
    private router: Router) {
		this.total$ = _tableService.total$;
		// this.searchableColumn();
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
    this.translate.get('general.invoiceApproveSuccess').subscribe(res => this.invoiceApproveSuccess = res);
    this.translate.get('general.invoiceStatusChangeSuccess').subscribe(res => this.invoiceStatusChangeSuccess = res);
    this.translate.get('general.noAdminRights').subscribe(res => this.noAdminRights = res);
    this.translate.get('general.emailIsSent').subscribe(res => this.emailIsSent = res);
    this.translate.get('general.validateProcess').subscribe(res => this.validateProcess = res);
    this.translate.get('general.invoiceLimit').subscribe(res => this.invoiceLimit = res);
		this.getList();
    this.getSubscription();
	}

	getList() {
		this.loading = true;
		return this.invoiceService.getAll().subscribe( result => {
      if (result != null){
        this.invoicesData = result;
        this.totalInvoice = result.length;
        result.forEach(x => {
          x.customerName = x.customer.name;
          x.customerEmail = x.customer.email;
          x.dueDateIsPassed = false;
          if (new Date(x.issueDate) < new Date() && x.status !== Status.Paid){
            x.dueDateIsPassed = true;
          }
        });
		    this._tableService._search$.next();
        this._tableService.setEntities(this.invoicesData);
        this.invoices = this._tableService.entities$;
        this.loading = false;
      }
		}, (error) => {
		  console.log(error); this.loading = false;
		});
	}

  // deleteConfirmation(id: number) {
  //   this._dialogService.open(DeleteConfirmationComponent, { closeOnBackdropClick: false })
  //     .onClose.subscribe(result => {
  //       if(result === true){
  //         this.delete(id);
  //       }
  //   });
  // }

	// delete(id: number){
  //   if(this._authService.getCurrentUser().role.name != "Viewer"){
  //     return this.invoiceService.delete(id).subscribe(result => {
  //       this.showToast('success', this.deletedItem,4000);
  //       this.getList();
  //     }, error => {
  //       this.showToast('danger',this.errorMessage ,4000);
  //       console.log(error);
  //     });
  //   }
  //   else{
  //     this.showToast("warning",this.noAdminRights ,4000)
  //   }
	// }

	// onSort({column, direction}: SortEvent) {
	// 	this.headers.forEach(header => {
	// 	  if (header.sortable !== column) {
	// 	    header.direction = '';
	// 	  }
	// 	});
	// 	this._tableService.sortColumn = column;
	// 	this._tableService.sortDirection = direction;
	// }

	// searchableColumn(){
	// 	let attributeTypes: AttributeType[] = [
	// 	  { id: null, name: 'reference', type: 'string'},
	// 	  { id: null, name: 'customerName', type: 'string'},
	// 	  { id: null, name: 'customerEmail', type: 'string'},
	// 	  { id: null, name: 'issueDate', type: 'string'},
	// 	  { id: null, name: 'invoiceNumber', type: 'string'},
	// 	  { id: null, name: 'totalDiscount', type: 'number'},
	// 	  { id: null, name: 'totalAmount', type: 'number'},
	// 	  { id: null, name: 'totalTax', type: 'number'},
	// 	  { id: null, name: 'status', type: 'string'},
	// 	];
	// 	this._tableService.setAttributesType(attributeTypes);
	// }

	showToast(status: NbComponentStatus, message: string, duration: number) {
	  this.toastrService.show(status, message, { status, duration:duration });
	}

  // resend(invoice:Invoice){
  //   if(this._authService.getCurrentUser().role.name != "Viewer"){
  //     if ([Status.Sent.toString(),Status.Paid.toString(), Status.PartialllyPaid.toString()].includes(invoice.status)){
  //       return this.invoiceService.resend(invoice).subscribe(
  //         () => {
  //           this.showToast("success",this.emailIsSent ,4000);
  //         },error => {
  //           console.log(error);
  //           this.showToast("danger",this.errorMessage ,4000)
  //         }
  //       );
  //     }else {
  //       this.showToast('warning',this.validateProcess,4000)
  //     }
  //   }
  //   else{
  //     this.showToast("warning",this.noAdminRights ,4000);
  //   }
  // }

  getSubscription(){
    return this.subscriptionService.getTenantSubscription(this._authService.getCurrentUser().tenantId).subscribe(
      (result) => {
        this.subscription = result;
        if(result != null && result.plan){
          if (result.plan.maxOrder <= -1){
            this.subscriptionPercentLimit = 0;
          }else{
            this.subscriptionPercentLimit = (this.totalInvoice / result.plan.maxOrder) * 100;
          }
        }
      }
    );
  }

  redirectToInvoiceCreateComponent(){
    console.log(this.subscription);
    if (this.subscription != null && this.subscription.canCreateInvoice){
      this.router.navigateByUrl('/dashboard/invoice/create')
    }else{
      this.showToast("warning", this.invoiceLimit,0)
    }
  }

  tabChanged(event: any){
    if (this.invoicesData != null){
      if (event.tabId.toLowerCase() === "all"){
        this._tableService._search$.next();
        this._tableService.setEntities(this.invoicesData);
        this.invoices = this._tableService.entities$;
      }
      else if (event.tabId.toLowerCase() === "recurring"){
        this._tableService._search$.next();
          this._tableService.setEntities(this.invoicesData.filter(x => x.isRecurring));
          this.invoices = this._tableService.entities$;
      }
      else if (event.tabId.toLowerCase() === "drafted"){
        this._tableService._search$.next();
          this._tableService.setEntities(this.invoicesData.filter(x => x.status === "Draft"));
          this.invoices = this._tableService.entities$;
      }
      else if (event.tabId.toLowerCase() === "approved"){
        this._tableService._search$.next();
          this._tableService.setEntities(this.invoicesData.filter(x => x.status === "Approved"));
          this.invoices = this._tableService.entities$;
      }
      else if (event.tabId.toLowerCase() === "sent"){
        this._tableService._search$.next();
          this._tableService.setEntities(this.invoicesData.filter(x => x.status === "Sent"));
          this.invoices = this._tableService.entities$;
      }
      else if (event.tabId.toLowerCase() === "overdue"){
        this._tableService._search$.next();
          this._tableService.setEntities(this.invoicesData.filter(x => x.dueDateIsPassed ));
          this.invoices = this._tableService.entities$;
      }
      else if (event.tabId.toLowerCase() === "paid"){
        this._tableService._search$.next();
        this._tableService.setEntities(this.invoicesData.filter(x => x.status === "Paid"));
        this.invoices = this._tableService.entities$;
      }
    }
  }


}
