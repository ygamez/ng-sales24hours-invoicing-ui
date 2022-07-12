
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService, NbComponentStatus, NbDialogService } from '@nebular/theme';
import { ProductService } from 'src/app/service/product.service';
import { Product } from 'src/app/models/product';
import { TableService } from 'src/app/service/table.service';
import { AttributeType } from 'src/app/models/attributeType';
import { NgbdSortableHeader, SortEvent } from 'src/app/directive/sortable.directive';
import { Observable } from 'rxjs';
import { DeleteConfirmationComponent } from '../../delete-confirmation/delete-confirmation.component';
import { CurrencyService } from 'src/app/service/currency.service';
import { Currency } from 'src/app/models/currency';
import { SubscriptionService } from 'src/app/service/subscription.service';
import { AuthService } from 'src/app/service/auth.service';
import { Subscription } from 'src/app/models/subscription';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'product-list',
	templateUrl: './product-list.component.html',
	styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
	public products: Observable<Product[]>;
	public message: string;
	public loading: boolean = false;
	public total$: Observable<number>;
	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  public currency: Currency;
  public subscription: Subscription;
  public subscriptionPercentLimit: number;
  public totalProduct: number;
  public errorMessage: string;
  public deletedItem: string;
  public invoiceDelete: string;
  public productLimit: string;

	constructor(private productService : ProductService,
    private translate: TranslateService,
    private currencyService: CurrencyService,
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
    this.translate.get('general.productLimit').subscribe(res => this.productLimit = res);
		this.getList();
    this.getDefaultCurrency();
	}

	getList() {
		this.loading = true;
		return this.productService.getAll().subscribe( result => {
      this.totalProduct = result.length;
		  this._tableService._search$.next();
		  this._tableService.setEntities(result);
		  this.products = this._tableService.entities$;
		  if (result.length == 0) this.message = "There is no data at this time...";
		  this.loading = false;
      this.getSubscription();
      result.forEach(x =>{
        x.categoryName = x.category.name;
        x.taxName = x.tax?.name;
      });
		}, (error) => {
		  console.log(error); this.loading = false;
		});
	}

	delete(id: number){
		return this.productService.delete(id).subscribe(result => {
		  this.showToast('success', this.deletedItem ,4000);
		  this.getList();
		}, error => {
		  this.showToast('danger', this.invoiceDelete ,4000);
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
		  { id: null, name: 'sku', type: 'string'},
		  { id: null, name: 'salePrice', type: 'number'},
		  { id: null, name: 'purchasePrice', type: 'number'},
		  { id: null, name: 'categoryName', type: 'string'},
		  { id: null, name: 'taxName', type: 'string'},
		];
		this._tableService.setAttributesType(attributeTypes);
	}

  showToast(status: NbComponentStatus, message: string, duration: number) {
	  this.toastrService.show(status, message, { status, duration:duration });
	}

  getSubscription(){
    return this.subscriptionService.getTenantSubscription(this.authService.getCurrentUser().tenantId).subscribe(
      (result) => {
        this.subscription = result;
        if(result != null && result.plan){
          if (result.plan.maxProduct <= -1){
            this.subscriptionPercentLimit = 0;
          }else{
            this.subscriptionPercentLimit = (this.totalProduct / result.plan.maxProduct) * 100;
          }
        }
      }
    );
  }

  redirectToPdtCreateComponent(){
    if (this.subscription != null && this.subscription.canCreateProduct){
      this.router.navigateByUrl('/dashboard/product/create')
    }else{
      this.showToast("warning", this.productLimit,0)
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

  getDefaultCurrency(){
    return this.currencyService.getDefault().subscribe(
      result => {
        this.currency = result;
      },error => {
        console.log(error);
      }
    )
  }

}
