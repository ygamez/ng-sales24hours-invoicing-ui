import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/app/service/auth.service';
import { CategoryService } from 'src/app/service/category.service';
import { Category } from 'src/app/models/category';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'category-create',
	templateUrl: './category-create.component.html',
	styleUrls: ['./category-create.component.scss']
})
export class CategoryCreateComponent implements OnInit {
	formTitle: string = "Add new category";
	entityForm: FormGroup;
	loading: boolean = false;
	id: string = this.activatedRoute.snapshot.params["id"];
  errorMessage: string;

	constructor(private translate: TranslateService,
		private categoryService : CategoryService,
		private router: Router,
		private _authService: AuthService,
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private toastrService: NbToastrService
	){
		this.entityForm = this.fb.group({
		  name: ['',[Validators.required]],
		  type: ['product',[Validators.required]],
		});
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
	  this.getCategory();
	}

	save(entity: Category) {
		if (this.entityForm.valid){
		  this.loading = true;
		  this.loading = true;
		  entity.createdById = this._authService.getCurrentUser().id;
		  if (this.id != null && this.id !==''){
		      entity.id = +this.id;
		      return this.categoryService.update(entity)
		      .subscribe(() => this.router.navigateByUrl('dashboard/setting-list/category-list'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', this.errorMessage)
		      });
		  } else {
		      return this.categoryService.create(entity)
		      .subscribe(() => this.router.navigateByUrl('dashboard/setting-list/category-list'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', this.errorMessage)
		      });
		  }
		}
	}

	getCategory(){
		if(this.id != null && this.id !== ""){
		this.formTitle = "Update category";
		  let id : number = +this.id;
		  return this.categoryService.getSingle(id).subscribe(
		    result => {
		      this.entityForm.patchValue(result);
		    }, error => {
		      console.log(error);
		    }
		  );
		}
	}

	showToast(status: NbComponentStatus, message: string): void {
		this.toastrService.show(status, message, { status, duration:4000 });
	}
}
