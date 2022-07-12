import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/app/service/auth.service';
import { ProductService } from 'src/app/service/product.service';
import { Product } from 'src/app/models/product';
import { CategoryService } from 'src/app/service/category.service';
import { Category } from 'src/app/models/category';
import { TaxeService } from 'src/app/service/taxe.service';
import { Taxe } from 'src/app/models/taxe';
import { CurrencyService } from 'src/app/service/currency.service';
import { Currency } from 'src/app/models/currency';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'product-create',
	templateUrl: './product-create.component.html',
	styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent implements OnInit {
	formTitle: string = "Add new product";
	entityForm: FormGroup;
	loading: boolean = false;
	id: string = this.activatedRoute.snapshot.params["id"];
	public categories: Category[] = [];
	public taxes: Taxe[] = [];
  editLoading: boolean = false;
  currency: Currency;
  errorMessage: string;
  deletedItem: string;

	constructor(private translate: TranslateService,
		private productService : ProductService,
		private router: Router,
		private _authService: AuthService,
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private categoryService: CategoryService,
		private taxeService: TaxeService,
		private toastrService: NbToastrService,
    private currencyService: CurrencyService
	){
		this.entityForm = this.fb.group({
		  name: ['',[Validators.required]],
		  sku: '',
		  salePrice: [0,[Validators.required]],
		  purchasePrice: [0,[Validators.required]],
		  categoryId: ['',[Validators.required]],
		  taxId: '',
		  description: '',
		});
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
	  this.getProduct();
		this.getCategory();
		this.getTaxe();
    this.getDefaultCurrency();
	}

	save(entity: Product) {
		if (this.entityForm.valid){
		  this.loading = true;
		  entity.createdById = this._authService.getCurrentUser().id;
		  if (this.id != null && this.id !==''){
		      entity.id = +this.id;
		      return this.productService.update(entity)
		      .subscribe(() => this.router.navigateByUrl('dashboard/product-list'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', 'An error has occurred. Please try again!')
		      });
		  } else {
		      return this.productService.create(entity)
		      .subscribe(() => this.router.navigateByUrl('dashboard/product-list'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger',  this.errorMessage);
		      });
		  }
		}
	}

	getProduct(){
		if(this.id != null && this.id !== ""){
    this.editLoading = true;
		this.formTitle = "Update product";
		  let id : number = +this.id;
		  return this.productService.getSingle(id).subscribe(
		    result => {
          this.editLoading = false;
		      this.entityForm.patchValue(result);
		    }, error => {
          this.editLoading = false;
		      console.log(error);
		    }
		  );
		}
	}

	getCategory(){
	  return this.categoryService.getAll().subscribe( result => {
	    this.categories = result.filter(x => x.type === "product");
	  }, error => {
	    console.log(error);
	  });
	}

	getTaxe(){
	  return this.taxeService.getAll().subscribe( result => {
	    this.taxes = result;
	  }, error => {
	    console.log(error);
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

	showToast(status: NbComponentStatus, message: string): void {
		this.toastrService.show(status, message, { status, duration:4000 });
	}
}
