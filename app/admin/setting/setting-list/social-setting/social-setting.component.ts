import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { Setting } from 'src/app/models/setting';
import { SettingType } from 'src/app/models/setting-type';
import { SettingService } from 'src/app/service/setting.service';

@Component({
  selector: 'app-social-setting',
  templateUrl: './social-setting.component.html',
  styleUrls: ['./social-setting.component.scss']
})
export class SocialSettingComponent implements OnInit {
  formTitle: string;
	entityForm: FormGroup;
	loading: boolean = false;
	id: number = 0;

	constructor(
		private settingService : SettingService,
		private router: Router,
		private fb: FormBuilder,
    private toastrService: NbToastrService,
	){
		this.entityForm = this.fb.group({
      twitter: '',
      instagram: '',
      youtube: '',
      facebook: '',
		});
	}

	ngOnInit(): void {
	  this.getSetting();
	}

	save(entity: Setting) {
		if (this.entityForm.valid){
      if (this.id != 0){
        entity.id = this.id;
        entity.type = SettingType.SOCIAL;
        this.showToast('success', 'Payment settings have been saved!!')
        return this.settingService.update(entity)
        .subscribe(() => {
          this.router.navigateByUrl('dashboard/setting-list/social-settings');
        },
        error => {
            this.loading = false;
            console.log(error);
            this.showToast('danger', 'An error has occurred. Please try again!')
        });
      }
		}
	}

	getSetting(){
    this.formTitle = "Update payment settings";
    return this.settingService.getByType(SettingType.SOCIAL).subscribe(
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
