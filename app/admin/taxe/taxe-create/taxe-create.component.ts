import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/app/service/auth.service';
import { TaxeService } from 'src/app/service/taxe.service';
import { Taxe } from 'src/app/models/taxe';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'taxe-create',
	templateUrl: './taxe-create.component.html',
	styleUrls: ['./taxe-create.component.scss']
})
export class TaxeCreateComponent implements OnInit {
	formTitle: string = "Add new taxe";
	entityForm: FormGroup;
	loading: boolean = false;
	id: string = this.activatedRoute.snapshot.params["id"];
  parentRoute: string;
  errorMessage: string;
  deletedItem: string;

	constructor(private translate: TranslateService,
		private taxeService : TaxeService,
		private router: Router,
		private _authService: AuthService,
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private toastrService: NbToastrService
	){
		this.entityForm = this.fb.group({
		  name: ['',[Validators.required]],
		  rate: ['',[Validators.required]],
		});
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentRoute = urlPath[urlPath.length - 1].path;
    });
	  this.getTaxe();
	}

	save(entity: Taxe) {
		if (this.entityForm.valid){
		  this.loading = true;
      entity.type = this.parentRoute;
		  entity.createdById = this._authService.getCurrentUser().id;
		  if (this.id != null && this.id !==''){
		      entity.id = +this.id;
		      return this.taxeService.update(entity)
		      .subscribe(() => this.router.navigateByUrl('/dashboard/'+this.parentRoute+'/taxes'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', this.errorMessage)
		      });
		  } else {
		      return this.taxeService.create(entity)
		      .subscribe(() => this.router.navigateByUrl('/dashboard/'+this.parentRoute+'/taxes'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', this.errorMessage)
		      });
		  }
		}
	}

	getTaxe(){
		if(this.id != null && this.id !== ""){
		this.formTitle = "Update taxe";
		  let id : number = +this.id;
		  return this.taxeService.getSingle(id).subscribe(
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
