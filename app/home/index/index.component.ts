import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NbThemeService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Plan } from 'src/app/models/plan';
import { SettingType } from 'src/app/models/setting-type';
import { AuthService } from 'src/app/service/auth.service';
import { IndexService } from 'src/app/service/index.service';
import { PlanService } from 'src/app/service/plan.service';
import { SettingService } from 'src/app/service/setting.service';
import { LANGUAGE } from 'src/assets/translate/language';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  userIsAuthenticated : boolean = false;
  plans: Plan[];
  applicationTitle: string = "Sales24hours";
  logo: string;
  appSubTitle: string;
  langs = LANGUAGE;
  selectedLang: string = "en";

  constructor(private authService: AuthService,
    private translate: TranslateService,
    private indexService: IndexService,
    private titleService: Title,
    private settingService: SettingService) {
    this.userIsAuthenticated = this.authService.userIsAuthenticated();
  }

  ngOnInit() {
    this.getPlans();
    this.getSetting();
    if (localStorage.getItem('lang') != null){
      this.translate.setDefaultLang(localStorage.getItem('lang'));
    }else{
      this.translate.setDefaultLang("en");
    }
    this.selectedLang = localStorage.getItem('lang');
    this.translate.get('general.appSubTitle').subscribe(res =>{
      console.log(res)
        this.titleService.setTitle(this.applicationTitle+" - "+ res)
      }
    );
  }

  getPlans() {
    this.indexService.getPlans().subscribe(plans => {
      this.plans = plans.filter(x => x.state === "Visible");;
      if (plans != null){
      }
    }, (error) => {console.log(error)});
  }

  getSetting(){
    return this.settingService.getByType(SettingType.GENERAL).subscribe(
      result => {
        if (result != null){
          this.applicationTitle = result.appTitle;
          this.logo = result.logo;
        }
      }, error => {
        console.log(error);
      }
    );
	}

  onLangChange(value){
    localStorage.setItem('lang',value)
    if (localStorage.getItem('lang') != null){
      this.translate.setDefaultLang(localStorage.getItem('lang'));
    }else{
      this.translate.setDefaultLang("es");
    }
    this.selectedLang = localStorage.getItem('lang')
    window.location.reload();
  }

}
