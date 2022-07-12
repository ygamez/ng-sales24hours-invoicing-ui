import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Setting } from 'src/app/models/setting';
import { SettingType } from 'src/app/models/setting-type';
import { SettingService } from 'src/app/service/setting.service';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss']
})
export class LicenseComponent implements OnInit {
  cardLoading: boolean;
  formTitle: string;
	entityForm: FormGroup;
	loading: boolean = false;
	id: number = 0;
  licenseName: string;
  errorMessage: string;
  saveSetting: string;
  demoMode: string;

	constructor(private settingService : SettingService,
    private translate: TranslateService,
		private router: Router,
		private fb: FormBuilder,
    private toastrService: NbToastrService){
		this.entityForm = this.fb.group({
      license: ''
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
      this.loading = true;
      if (this.id != 0){
        entity.id = this.id;
        entity.type = SettingType.LICENSE;
        entity.domainUrl = window.location.hostname;
        return this.settingService.activatedLicense(entity)
        .subscribe((result) => {
          this.loading = false;
          window.location.reload();
          this.showToast('success', this.saveSetting);
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
    this.cardLoading = true;
    return this.settingService.getByType(SettingType.LICENSE).subscribe(
      result => {
        if (result != null){
          this.cardLoading = false;
          this.id = result.id;
          this.licenseName = result.licenseTypeName;
          this.entityForm.patchValue(result);
        }
      }, error => {
        this.cardLoading = false;
        console.log(error);
      }
    );
	}

  showToast(status: NbComponentStatus, message: string): void {
		this.toastrService.show(status, message, { status, duration:4000 });
	}

}
