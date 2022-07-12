import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/app/service/auth.service';
import { SettingService } from 'src/app/service/setting.service';
import { Setting } from 'src/app/models/setting';

@Component({
	selector: 'setting-create',
	templateUrl: './setting-create.component.html',
	styleUrls: ['./setting-create.component.scss']
})
export class SettingCreateComponent implements OnInit {
	formTitle: string = "Add new setting";
	entityForm: FormGroup;
	loading: boolean = false;
	id: string = this.activatedRoute.snapshot.params["id"];

	constructor(
		private settingService : SettingService,
		private router: Router,
		private _authService: AuthService,
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private toastrService: NbToastrService
	){
		this.entityForm = this.fb.group({
		  logo: ['',[Validators.required]],
		  sendInvoice: ['',[Validators.required]],
		  stripeWebhookSecret: ['',[Validators.required]],
		  theme: ['',[Validators.required]],
		  language: ['',[Validators.required]],
		  emailConfirmation: ['',[Validators.required]],
		  appTitle: ['',[Validators.required]],
		  favicon: ['',[Validators.required]],
		  type: ['',[Validators.required]],
		  enablePayments: ['',[Validators.required]],
		  currency: ['',[Validators.required]],
		  enableDiscount: ['',[Validators.required]],
		  enablePaypal: ['',[Validators.required]],
		  paypalMode: ['',[Validators.required]],
		  paypalClientId: ['',[Validators.required]],
		  paypalSecret: ['',[Validators.required]],
		  enableStripe: ['',[Validators.required]],
		  stripePublishableKey: ['',[Validators.required]],
		  stripeSecretKey: ['',[Validators.required]],
		  youtube: ['',[Validators.required]],
		  facebook: ['',[Validators.required]],
		  twitter: ['',[Validators.required]],
		  fromNameEmail: ['',[Validators.required]],
		  instagram: ['',[Validators.required]],
		  fromEmail: ['',[Validators.required]],
		  emailHost: ['',[Validators.required]],
		  encryption: ['',[Validators.required]],
		  emailPort: ['',[Validators.required]],
		  authentication: ['',[Validators.required]],
		  username: ['',[Validators.required]],
		  password: ['',[Validators.required]],
		  customHeadScript: ['',[Validators.required]],
		  customCss: ['',[Validators.required]],
		  emailNotification: ['',[Validators.required]],
		  license: ['',[Validators.required]],
		  licenseType: ['',[Validators.required]],
		});
	}

	ngOnInit(): void {
	  this.getSetting();
	}

	save(entity: Setting) {
		if (this.entityForm.valid){
		  this.loading = true;
		  this.loading = true;
		  entity.createdById = this._authService.getCurrentUser().id;
		  if (this.id != null && this.id !==''){
		      entity.id = +this.id;
		      return this.settingService.update(entity)
		      .subscribe(() => this.router.navigateByUrl('dashboard/setting-list'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', 'An error has occurred. Please try again!')
		      });
		  } else {
		      return this.settingService.create(entity)
		      .subscribe(() => this.router.navigateByUrl('dashboard/setting-list'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', 'An error has occurred. Please verify your informations and try again!')
		      });
		  }
		}
	}

	getSetting(){
		if(this.id != null && this.id !== ""){
		this.formTitle = "Update setting";
		  let id : number = +this.id;
		  return this.settingService.getSingle(id).subscribe(
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
