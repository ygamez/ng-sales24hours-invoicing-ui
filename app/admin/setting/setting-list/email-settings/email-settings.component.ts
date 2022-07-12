import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Setting } from 'src/app/models/setting';
import { SettingType } from 'src/app/models/setting-type';
import { SettingService } from 'src/app/service/setting.service';

@Component({
  selector: 'app-email-settings',
  templateUrl: './email-settings.component.html',
  styleUrls: ['./email-settings.component.scss']
})
export class EmailSettingsComponent implements OnInit {
  formTitle: string;
	entityForm: FormGroup;
	loading: boolean = false;
	id: number = 0;
  sending: boolean = false;
  errorMessage: string;
  deletedItem: string;
  savedEmail: string;
  demoMode: string;
  testEmailOk: string;

	constructor(private translate: TranslateService,
		private settingService : SettingService,
		private router: Router,
		private fb: FormBuilder,
    private toastrService: NbToastrService,
	){
		this.entityForm = this.fb.group({
      fromNameEmail: '',
      authentication: false,
      fromEmail: '',
      emailHost: '',
      encryption: '',
      emailPort: '',
      username: '',
      password: '',
		});
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
    this.translate.get('general.savedEmail').subscribe(res => this.savedEmail = res);
    this.translate.get('general.demoMode').subscribe(res => this.demoMode = res);
    this.translate.get('general.testEmailOk').subscribe(res => this.testEmailOk = res);
	  this.getSetting();
	}

	save(entity: Setting) {
		if (this.entityForm.valid){
      this.loading = true;
      if (this.id != 0){
        entity.id = this.id;
        entity.type = SettingType.EMAIL;
        return this.settingService.update(entity).subscribe(() => {
          this.loading = false;
          this.getSetting();
          this.showToast('success', this.savedEmail);
        },
        error => {
            this.loading = false;
            console.log(error);
            this.showToast('danger', this.errorMessage);
        });
      }
		}
	}

  restrict(){
    this.showToast('warning', this.demoMode);
  }

  sendTestEmail() {
    return this.settingService.sendTestMail().subscribe(() => {
      this.sending = false;
      this.getSetting();
      this.showToast('success', this.testEmailOk);
    },
    error => {
        this.sending = false;
        console.log(error);
        this.showToast('danger',this.errorMessage);
    });
	}

	getSetting(){
    this.formTitle = "Update payment settings";
    return this.settingService.getByType(SettingType.EMAIL).subscribe(
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
