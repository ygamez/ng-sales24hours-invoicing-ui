import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbDialogService, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { NgbdSortableHeader, SortEvent } from 'src/app/directive/sortable.directive';
import { AttributeType } from 'src/app/models/attributeType';
import { PaypalSubscription } from 'src/app/models/paypal-subscription';
import { Subscription } from 'src/app/models/subscription';
import { AuthService } from 'src/app/service/auth.service';
import { SubscriptionService } from 'src/app/service/subscription.service';
import { TableService } from 'src/app/service/table.service';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {
  public data: Subscription[];
  public subscriptions: Observable<Subscription[]>;
	public message: string;
	public loading: boolean = false;
	public total$: Observable<number>;
	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  parentRoute: string;
  userIsSuperAdmin: boolean = this.authService.userIsSuperAdmin();
  agreementCreatedToken: string;
  totalSubscription: number;
  errorMessage: string;

	constructor(private subscriptionService : SubscriptionService,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private _dialogService: NbDialogService,
    private toastrService: NbToastrService,
    public _tableService: TableService,
    private router: Router) {
		this.total$ = _tableService.total$;
		this.searchableColumn();
	}

  ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentRoute = urlPath[urlPath.length - 1].path;
    });

    if (this.authService.userIsSuperAdmin() && this.parentRoute === 'super-admin-console'){
      this.getSuperAdminSubscriptions();
    }else{
      this.getSubscriptions();
    }
  }

	getSubscriptions() {
		this.loading = true;
		return this.subscriptionService.getAllSubscriptions(this.authService.getCurrentUser().id).subscribe( result => {
		  // this.subscriptions = result;
      this.totalSubscription = result.length;
      this._tableService._search$.next();
      this._tableService.setEntities(result);
      this.subscriptions = this._tableService.entities$;
      this.data = result;
      this.data.forEach(x => {
        if (x.active && x.renew){
          x.status = "Active";
          x.badgeStatus = "success";
        }else if (!x.renew && x.active && !x.canceledAt){
          x.status = "Suspended";
          x.badgeStatus = "warning"
        }else if (!x.canceledAt){
          x.status="canceled";
          x.badgeStatus = "danger";
        }else if (!x.active && !x.renew){
          x.status = "Inactive";
          x.badgeStatus = "secondary";
        }
      });
		  this.loading = false;
		}, (error) => {
		  console.log(error); this.loading = false;
		});
	}

  getSuperAdminSubscriptions() {
		this.loading = true;
		return this.subscriptionService.getSuperAdminSubscriptions().subscribe( result => {
		  this.totalSubscription = result.length;
      this._tableService._search$.next();
      this._tableService.setEntities(result);
      this.subscriptions = this._tableService.entities$;
		  this.data = result;
      this.data.forEach(x => {
        if (x.active && x.renew){
          x.status = "Active";
          x.badgeStatus = "success";
        }else if (!x.renew && x.active && !x.canceledAt){
          x.status = "Suspended";
          x.badgeStatus = "warning"
        }else if (!x.canceledAt){
          x.status="canceled";
          x.badgeStatus = "danger";
        }else if (!x.active && !x.renew){
          x.status = "Inactive";
          x.badgeStatus = "secondary";
        }
      });
		  this.loading = false;
		}, (error) => {
		  console.log(error); this.loading = false;
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
		  // { id: null, name: 'name', type: 'string'},
		  // { id: null, name: 'amount', type: 'number'},
		  // { id: null, name: 'renewAt', type: 'string'},
		  // { id: null, name: 'subscribedOn', type: 'string'},
		  // { id: null, name: 'startAt', type: 'string'},
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

  delete(id: number){
		return this.subscriptionService.deleteSubscription(id).subscribe(result => {
		  this.showToast('success',"The item are succefully deleted!");
      if (this.authService.userIsSuperAdmin() && this.parentRoute === 'super-admin-console'){
        this.getSuperAdminSubscriptions();
      }else{
        this.getSubscriptions();
      }
		}, error => {
		  this.showToast('danger',this.errorMessage);
		  console.log(error);
		});
	}

  executePaypalSubscription(paypalSubscription: PaypalSubscription){
    this.loading = true;
    return this.subscriptionService.executePaypalSubscription(paypalSubscription).subscribe(
      () => {
        window.location.href = "/dashboard/home";
      },
      error => {
        this.loading = false;
        console.log(error);
      }
    );
  }

  cancelSubscription(data:Subscription){
    this.loading = true;
    return this.subscriptionService.cancelSubscription(data).subscribe(
      result => {
        window.location.reload();
        // this.getSubscriptions();
        this.loading = false;
      }, error => {
        this.loading = false;
        console.log(error);
      }
    )
  }

}
