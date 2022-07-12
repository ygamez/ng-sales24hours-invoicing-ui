
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService, NbComponentStatus, NbDialogService } from '@nebular/theme';
import { ProposalService } from 'src/app/service/proposal.service';
import { Proposal } from 'src/app/models/proposal';
import { TableService } from 'src/app/service/table.service';
import { AttributeType } from 'src/app/models/attributeType';
import { NgbdSortableHeader, SortEvent } from 'src/app/directive/sortable.directive';
import { Observable } from 'rxjs';
import { Status } from 'src/app/models/status';
import { DeleteConfirmationComponent } from '../../delete-confirmation/delete-confirmation.component';
import { AuthService } from 'src/app/service/auth.service';
import { SubscriptionService } from 'src/app/service/subscription.service';
import { Subscription } from 'src/app/models/subscription';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'proposal-list',
	templateUrl: './proposal-list.component.html',
	styleUrls: ['./proposal-list.component.scss']
})
export class ProposalListComponent implements OnInit {
	public proposals: Observable<Proposal[]>;
	public message: string;
	public loading: boolean = false;
	public total$: Observable<number>;
	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  public lastProposalId: number = 0;
  public subscription: Subscription;
  public subscriptionPercentLimit : number = 0;
  public totalEstimate: number;
  proposalApproveSuccess: string;
  proposalStatusChangeSuccess: string;
  noAdminRights: string;
  emailIsSent: string;
  deletedItem: string;
  proposalLimit: string;
  errorMessage: string;
  validateProcess: string;

	constructor(private proposalService : ProposalService,
    private translate: TranslateService,
    private toastrService: NbToastrService,
    public _tableService: TableService,
    private _dialogService: NbDialogService,
    private subscriptionService: SubscriptionService,
    private _authService: AuthService,
    private router: Router) {
		this.total$ = _tableService.total$;
		this.searchableColumn();
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
    this.translate.get('general.invoiceApproveSuccess').subscribe(res => this.proposalApproveSuccess = res);
    this.translate.get('general.invoiceStatusChangeSuccess').subscribe(res => this.proposalStatusChangeSuccess = res);
    this.translate.get('general.noAdminRights').subscribe(res => this.noAdminRights = res);
    this.translate.get('general.emailIsSent').subscribe(res => this.emailIsSent = res);
    this.translate.get('general.validateProcess').subscribe(res => this.validateProcess = res);
    this.translate.get('general.invoiceLimit').subscribe(res => this.proposalLimit = res);
		this.getList();
	}

	getList() {
		this.loading = true;
		return this.proposalService.getAll().subscribe( result => {
      if (result != null){
        this.totalEstimate = result.length;
        result.forEach(x => {
          x.customerName = x.customer.name;
          x.customerEmail = x.customer.email;
          x.dueDateIsPassed = false;
          if (new Date(x.issueDate) < new Date()){
            x.dueDateIsPassed = true;
          }
        });
		    this._tableService._search$.next();
        this._tableService.setEntities(result);
        this.proposals = this._tableService.entities$;
        this.loading = false;
      }
      this.getSubscription();
		}, (error) => {
		  console.log(error); this.loading = false;
		});
	}

	delete(id: number){
    if(this._authService.getCurrentUser().role.name != "Viewer"){
      return this.proposalService.delete(id).subscribe(result => {
        this.showToast('success', this.deletedItem,4000);
        this.getList();
      }, error => {
        this.showToast('danger', this.errorMessage,4000);
        console.log(error);
      });
    }
    else{
      this.showToast("warning", this.noAdminRights,4000)
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
		  { id: null, name: 'totalAmount', type: 'number'},
		  { id: null, name: 'status', type: 'string'},
		];
		this._tableService.setAttributesType(attributeTypes);
	}

	showToast(status: NbComponentStatus, message: string, duration: number) {
	  this.toastrService.show(status, message, { status, duration:duration });
	}

  resend(proposal:Proposal){
    if(this._authService.getCurrentUser().role.name != "Viewer"){
      if (![Status.Draft.toString()].includes(proposal.status)){
        return this.proposalService.resend(proposal).subscribe(
          () => {
            this.showToast("success", this.emailIsSent,4000);
          },error => {
            console.log(error);
            this.showToast("danger", this.errorMessage, 4000)
          }
        );
      }else {
        this.showToast('warning',this.validateProcess ,4000)
      }
    }
    else{
      this.showToast("warning",this.noAdminRights,4000)
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

  getSubscription(){
    return this.subscriptionService.getTenantSubscription(this._authService.getCurrentUser().tenantId).subscribe(
      (result) => {
        this.subscription = result;
        if(result != null && result.plan){
          if (result.plan.maxEstimate <= -1){
            this.subscriptionPercentLimit = 0;
          }else{
            this.subscriptionPercentLimit = (this.totalEstimate / result.plan.maxEstimate) * 100;
          }
        }
      }
    );
  }

  redirectToEstimateCreateComponent(){
    if (this.subscription != null && this.subscription.canCreateEstimate){
      this.router.navigateByUrl('/dashboard/proposal/create')
    }else{
      this.showToast("warning",  this.noAdminRights,0)
    }
  }
}
