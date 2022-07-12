import { Component, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { SettingType } from './models/setting-type';
import { SettingService } from './service/setting.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  favIcon: HTMLLinkElement = document.querySelector('#appIcon');
  private apiUrl = environment.apiHost
  language: string;

  constructor(private themeService: NbThemeService,
    private settingService: SettingService,
    private translate: TranslateService){

    }

  ngOnInit(): void {
    this.getSocialLoginSetting();
    this.getWebsitePreference();

  }

  getSocialLoginSetting(){
    return this.settingService.getByType(SettingType.SOCIAL_LOGIN).subscribe(
      result => {
        if (result != null){
          localStorage.setItem('googleId',result.googleClientId);
          localStorage.setItem('facebookId',result.facebookAppId);
        }
      }, error => {
        console.log(error);
      }
    );
	}

  getWebsitePreference(){
    return this.settingService.getByType(SettingType.GENERAL).subscribe(
      result => {
        if (result != null){
          if (localStorage.getItem('lang') != null){
            this.translate.setDefaultLang(localStorage.getItem('lang'));
          } else if (result.language != null){
            this.translate.setDefaultLang(result.language);
          }
          else{
            this.translate.setDefaultLang("es");
          }
        }
      }, error => {
        console.log(error);
      }
    );
  }

}
