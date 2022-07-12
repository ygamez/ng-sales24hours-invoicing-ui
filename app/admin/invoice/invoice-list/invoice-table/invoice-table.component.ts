import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Route, Router } from '@angular/router';
import { NbComponentStatus, NbDialogService, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { DeleteConfirmationComponent } from 'src/app/admin/delete-confirmation/delete-confirmation.component';
import { NgbdSortableHeader, SortEvent } from 'src/app/directive/sortable.directive';
import { AttributeType } from 'src/app/models/attributeType';
import { Invoice } from 'src/app/models/invoice';
import { Status } from 'src/app/models/status';
import { AuthService } from 'src/app/service/auth.service';
import { InvoiceService } from 'src/app/service/invoice.service';
import { TableService } from 'src/app/service/table.service';

@Component({
  selector: 'invoice-table',
  templateUrl: './invoice-table.component.html',
  styleUrls: ['./invoice-table.component.scss']
})
export class InvoiceTableComponent implements OnInit {
	@Input() invoices: Observable<Invoice[]>;
	public loading: boolean = false;
	public total$: Observable<number>;
	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  public totalInvoice: number;
  errorMessage: string;
  noAdminRights: string;
  deletedItem: string;
  validateProcess: string;
  emailIsSent: string;

  constructor(public _tableService: TableService,
    private translate: TranslateService,
    private _authService: AuthService,
    private invoiceService: InvoiceService,
    private toastrService: NbToastrService,
    private router: Router,
    private _dialogService: NbDialogService) {
      this.total$ = _tableService.total$;
      this.searchableColumn();
    }

  ngOnInit() {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
    this.translate.get('general.noAdminRights').subscribe(res => this.noAdminRights = res);
    this.translate.get('general.emailIsSent').subscribe(res => this.emailIsSent = res);
    this.translate.get('general.validateProcess').subscribe(res => this.validateProcess = res);
		// this.getList();
  }

  // getList() {
	// 	this.loading = true;
	// 	return this.invoiceService.getAll().subscribe( result => {
  //     if (result != null){
  //       this.totalInvoice = result.length;
  //       result.forEach(x => {
  //         x.customerName = x.customer.name;
  //         x.customerEmail = x.customer.email;
  //         x.dueDateIsPassed = false;
  //         if (new Date(x.issueDate) < new Date() && x.status !== Status.Paid){
  //           x.dueDateIsPassed = true;
  //         }
  //       });
	// 	    this._tableService._search$.next();
  //       this._tableService.setEntities(result);
  //       this.invoices = this._tableService.entities$;
  //       this.loading = false;
  //     }
	// 	}, (error) => {
	// 	  console.log(error); this.loading = false;
	// 	});
	// }

  deleteConfirmation(id: number) {
    this._dialogService.open(DeleteConfirmationComponent, { closeOnBackdropClick: false })
      .onClose.subscribe(result => {
        if(result === true){
          this.delete(id);
        }
    });
  }

	delete(id: number){
    if(this._authService.getCurrentUser().role.name != "Viewer"){
      return this.invoiceService.delete(id).subscribe(result => {
        this.showToast('success', this.deletedItem,4000);
        // this.getList();
        this.reloadCurrentRoute();

      }, error => {
        this.showToast('danger',this.errorMessage ,4000);
        console.log(error);
      });
    }
    else{
      this.showToast("warning",this.noAdminRights ,4000)
    }
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
		  { id: null, name: 'customerName', type: 'string'},
		  { id: null, name: 'customerEmail', type: 'string'},
		  { id: null, name: 'issueDate', type: 'string'},
		  { id: null, name: 'invoiceNumber', type: 'string'},
		  { id: null, name: 'totalDiscount', type: 'number'},
		  { id: null, name: 'totalAmount', type: 'number'},
		  { id: null, name: 'totalTax', type: 'number'},
		  { id: null, name: 'status', type: 'string'},
		];
		this._tableService.setAttributesType(attributeTypes);
	}

	showToast(status: NbComponentStatus, message: string, duration: number) {
	  this.toastrService.show(status, message, { status, duration:duration });
	}

  resend(invoice:Invoice){
    if(this._authService.getCurrentUser().role.name != "Viewer"){
      if ([Status.Sent.toString(),Status.Paid.toString(), Status.PartialllyPaid.toString()].includes(invoice.status)){
        return this.invoiceService.resend(invoice).subscribe(
          () => {
            this.showToast("success",this.emailIsSent ,4000);
          },error => {
            console.log(error);
            this.showToast("danger",this.errorMessage ,4000)
          }
        );
      }else {
        this.showToast('warning',this.validateProcess,4000)
      }
    }
    else{
      this.showToast("warning",this.noAdminRights ,4000);
    }
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }

}
