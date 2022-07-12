import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbThemeService, NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/app/service/auth.service';
import { SettingService } from 'src/app/service/setting.service';
import { Setting } from 'src/app/models/setting';
import { SettingType } from 'src/app/models/setting-type';
import { FileUploaderService } from 'src/app/service/file-uploader.service';
import settings from '../../../../../assets/json/setting.json'
import { ApplicationSetting } from 'src/app/models/application-setting';
import { TranslateService } from '@ngx-translate/core';
import { LANGUAGE } from 'src/assets/translate/language';

@Component({
  selector: 'app-general-setting',
  templateUrl: './general-setting.component.html',
  styleUrls: ['./general-setting.component.scss']
})
export class GeneralSettingComponent implements OnInit {
  applicationSettings: ApplicationSetting = settings;
  formTitle: string = "Add new setting";
	entityForm: FormGroup;
	loading: boolean = false;
	id: number = 0;
  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];
  formData: FormData;
  currentTheme = 'default';
  logoUri:any = "assets/images/image-upload.jpg";
  faviconUri:any =  "assets/images/image-upload.jpg";
  logoFile:any;
  faviconFile:any;
  saving: boolean = false;
  setting: Setting;
  errorMessage: string;
  deletedItem: string;
  saveSetting: string;
  demoMode: string;
  selectFileFormat: string;
  faviconUploaded: string;
  svgFormat: string;
  langs = LANGUAGE;
  lang: string = localStorage.getItem('lang') != null ? localStorage.getItem('lang') : 'en';

	constructor(private translate: TranslateService,
		private settingService : SettingService,
		private router: Router,
		private _authService: AuthService,
		private fb: FormBuilder,
		private toastrService: NbToastrService,
    private fileUploaderService: FileUploaderService,
    private themeService: NbThemeService
	){
		this.entityForm = this.fb.group({
		  logo: '',
		  // theme: this.currentTheme,
		  language: '',
		  welcomeEmail: false,
		  appTitle: '',
		  favicon: '',
      currency: ''
		});
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
    this.translate.get('general.saveSetting').subscribe(res => this.saveSetting = res);
    this.translate.get('general.demoMode').subscribe(res => this.demoMode = res);
    this.translate.get('general.svgFormat').subscribe(res => this.svgFormat = res);
    this.translate.get('general.faviconUploaded').subscribe(res => this.faviconUploaded = res);
    this.translate.get('general.selectFileFormat').subscribe(res => this.selectFileFormat = res);
	  this.getSetting();
    if (localStorage.getItem('lang') != null){
      this.translate.setDefaultLang(localStorage.getItem('lang'));
    }else{
      this.translate.setDefaultLang("en");
    }
	}

	save(entity: Setting) {
		if (this.entityForm.valid){
      if (this.id != 0){
        entity.id = this.id;
        entity.type = SettingType.GENERAL;
        return this.settingService.update(entity)
        .subscribe((result) => {
          this.showToast('success', this.saveSetting);
          localStorage.setItem('lang',result.language)
          window.location.reload();
        },error => {
            this.loading = false;
            console.log(error);
            this.showToast('danger', this.saveSetting)
        });
      }
		}
	}

  restrict(){
    this.showToast('warning', this.demoMode);
  }

  getJsonSetting(){
    return this.settingService.getJsonSetting().subscribe(
      result => {
        if (result !=null){
          this.entityForm.patchValue(result.application);
          this.applicationSettings = result;
        }
      },error =>{
        console.log(error);
      }
    );
  }

	getSetting(){
    this.formTitle = "Update general settings";
    return this.settingService.getByType(SettingType.GENERAL).subscribe(
      result => {
        this.setting = result;
        if (result != null){
          this.id = result.id;
          if (result.logo !== null && result.logo !== '') this.logoUri = result.logo;
          if (result.favicon !== null && result.favicon !== '') this.faviconUri = result.favicon;
          this.entityForm.patchValue(result);
        }
      }, error => {
        console.log(error);
      }
    );
	}

  onLogoChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      var ext = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (ext == 'svg' || ext == 'png' || ext == 'jpeg' || ext == 'jpg') {
        if (ext == 'svg') {
          this.showToast('warning',this.svgFormat)
        }
        this.fileUploaderService.uploadLogo(file).subscribe(
          (result) => {
            if (result) this.logoUri = result;
            this.showToast('success', this.faviconUploaded);
          },error => {
            console.log(error);
            this.showToast('danger',this.errorMessage);
          }
        );
      } else {
        this.showToast('danger',this.selectFileFormat)
      }
    }
  }

  onFaviconChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      var ext = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (ext == 'svg' || ext == 'png' || ext == 'jpeg' || ext == 'jpg') {
        if (ext == 'svg') {
          this.showToast('warning', this.svgFormat);
        }
        this.fileUploaderService.uploadFavicon(file).subscribe(
          () => {
            this.showToast('success', this.faviconUploaded);
          },error => {
            console.log(error);
            this.showToast('danger', this.errorMessage);
          }
        );
      } else {
        this.showToast('danger',this.selectFileFormat);
      }
    }
  }

  previewLogo(file) {
    if (file != null) {
      var reader = new FileReader();
      reader.readAsDataURL(file); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.logoUri = reader.result; //add source to image
      }
    }
  }

  previewFavicon(file) {
    if (file != null) {
      var reader = new FileReader();
      reader.readAsDataURL(file); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.faviconUri = reader.result; //add source to image
      }
    }
  }

  delete(file:string){
    return this.fileUploaderService.delete(file).subscribe(
      () => {
        if (file === "logo"){
          this.logoUri = "assets/images/image-upload.jpg";
        }else if (file === "favicon"){
          this.faviconUri = "assets/images/image-upload.jpg";
        }
      },
      error => {
        console.log(error);
      }
    )
  }

	showToast(status: NbComponentStatus, message: string): void {
		this.toastrService.show(status, message, { status, duration:4000 });
	}

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

}
