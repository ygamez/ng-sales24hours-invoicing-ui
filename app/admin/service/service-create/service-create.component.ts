import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/app/service/auth.service';
import { ServiceService } from 'src/app/service/service.service';
import { Service } from 'src/app/models/service';
import { CategoryService } from 'src/app/service/category.service';
import { Category } from 'src/app/models/category';
import { TaxeService } from 'src/app/service/taxe.service';
import { Taxe } from 'src/app/models/taxe';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'service-create',
	templateUrl: './service-create.component.html',
	styleUrls: ['./service-create.component.scss']
})
export class ServiceCreateComponent implements OnInit {
	formTitle: string = "Add new service";
	entityForm: FormGroup;
	loading: boolean = false;
	id: string = this.activatedRoute.snapshot.params["id"];
	public categorys: Category[] = [];
	public taxes: Taxe[] = [];
  editLoading: boolean = false;
  errorMessage: string;
  deletedItem: string;

	constructor(private translate: TranslateService,
		private serviceService : ServiceService,
		private router: Router,
		private _authService: AuthService,
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private categoryService: CategoryService,
		private taxeService: TaxeService,
		private toastrService: NbToastrService
	){
		this.entityForm = this.fb.group({
		  name: ['',[Validators.required]],
		  sku:  '',
		  salePrice: [0,[Validators.required]],
		  purchasePrice: [0,[Validators.required]],
		  categoryId: ['',[Validators.required]],
		  taxId: '',
		  description: ''
		});
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
	  this.getService();
		this.getCategory();
		this.getTaxe();
	}

	save(entity: Service) {
		if (this.entityForm.valid){
		  this.loading = true;

		  entity.createdById = this._authService.getCurrentUser().id;
		  if (this.id != null && this.id !==''){
		      entity.id = +this.id;
		      return this.serviceService.update(entity)
		      .subscribe(() => this.router.navigateByUrl('dashboard/service-list'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', this.errorMessage)
		      });
		  } else {
		      return this.serviceService.create(entity)
		      .subscribe(() => this.router.navigateByUrl('dashboard/service-list'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', this.errorMessage)
		      });
		  }
		}
	}

	getService(){
		if(this.id != null && this.id !== ""){
    this.editLoading = true;
		this.formTitle = "Update service";
		  let id : number = +this.id;
		  return this.serviceService.getSingle(id).subscribe(
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
	    this.categorys = result.filter(x => x.type === "service");
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

	showToast(status: NbComponentStatus, message: string): void {
		this.toastrService.show(status, message, { status, duration:4000 });
	}
}
