import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/app/service/auth.service';
import { AssetsService } from 'src/app/service/assets.service';
import { Assets } from 'src/app/models/assets';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'assets-create',
	templateUrl: './assets-create.component.html',
	styleUrls: ['./assets-create.component.scss']
})
export class AssetsCreateComponent implements OnInit {
	formTitle: string;
	entityForm: FormGroup;
	loading: boolean = false;
	id: string = this.activatedRoute.snapshot.params["id"];
  occurredError: string;

	constructor(private translate: TranslateService,
		private assetsService : AssetsService,
		private router: Router,
		private _authService: AuthService,
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private toastrService: NbToastrService
	){
		this.entityForm = this.fb.group({
		  name: ['',[Validators.required]],
		  amount: ['',[Validators.required]],
		  purchaseDate: ['',[Validators.required]],
		  supportedDate: ['',[Validators.required]],
		  description: '',
		});
	}

	ngOnInit(): void {
	  this.getAssets();
    this.translate.get('general.occurredError').subscribe(res => { this.occurredError = res });
	}

	save(entity: Assets) {
		if (this.entityForm.valid){
		  this.loading = true;
		  this.loading = true;
		  entity.createdById = this._authService.getCurrentUser().id;
		  if (this.id != null && this.id !==''){
		      entity.id = +this.id;
		      return this.assetsService.update(entity)
		      .subscribe(() => this.router.navigateByUrl('dashboard/assets-list'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', this.occurredError)
		      });
		  } else {
		      return this.assetsService.create(entity)
		      .subscribe(() => this.router.navigateByUrl('dashboard/assets-list'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', this.occurredError)
		      });
		  }
		}
	}

	getAssets(){
		if(this.id != null && this.id !== ""){
		this.formTitle = "Update assets";
		  let id : number = +this.id;
		  return this.assetsService.getSingle(id).subscribe(
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
