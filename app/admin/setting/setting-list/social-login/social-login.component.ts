import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Setting } from 'src/app/models/setting';
import { SettingType } from 'src/app/models/setting-type';
import { SettingService } from 'src/app/service/setting.service';

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.scss']
})
export class SocialLoginComponent implements OnInit {
  formTitle: string;
	entityForm: FormGroup;
	loading: boolean = false;
	id: number = 0;
  errorMessage: string;
  saveSetting: string;
  demoMode: string;

	constructor(private settingService : SettingService,
    private translate: TranslateService,
		private router: Router,
		private fb: FormBuilder,
    private toastrService: NbToastrService){
		this.entityForm = this.fb.group({
      googleClientId: '',
      facebookAppId: '',
      enableFacebookLogin: false,
      enableGoogleLogin: false
		});
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.saveSetting').subscribe(res => this.saveSetting = res);
    this.translate.get('general.demoMode').subscribe(res => this.demoMode = res);
	  this.getSetting();
	}

	save(entity: Setting) {
		if (this.entityForm.valid){
      if (this.id != 0){
        entity.id = this.id;
        entity.type = SettingType.SOCIAL_LOGIN;
        return this.settingService.update(entity)
        .subscribe(() => {
          this.showToast('success',  this.saveSetting)
        },
        error => {
            this.loading = false;
            console.log(error);
            this.showToast('danger', this.errorMessage)
        });
      }
		}
	}

  restrict(){
    this.showToast('warning', this.demoMode);
  }

	getSetting(){
    this.formTitle = "Update payment settings";
    return this.settingService.getByType(SettingType.SOCIAL_LOGIN).subscribe(
      result => {
        if (result != null){
          this.id = result.id;
          this.entityForm.patchValue(result);
        }
      }, error => {
        console.log(error);
      }
    );
	}

  showToast(status: NbComponentStatus, message: string): void {
		this.toastrService.show(status, message, { status, duration:4000 });
	}

}
