import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuItem, NbMenuService, NbSidebarService, NbThemeService, NbToastrService } from '@nebular/theme';

import { filter, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { SettingType } from 'src/app/models/setting-type';
import { SettingService } from 'src/app/service/setting.service';
import { Setting } from 'src/app/models/setting';
import { AuthService } from 'src/app/service/auth.service';
import { RoleEnum } from 'src/app/models/role-enum';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { CONTEXT_PROFILE } from 'src/assets/translate/profile-context';
import { LANGUAGE } from 'src/assets/translate/language';

@Component({
  selector: 'app-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  email: string;
  generalSetting: Setting;
  title: string;
  logo: string;
  favIcon: HTMLLinkElement = document.querySelector('#appIcon');
  icon: string = "moon-outline";
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
  currentTheme = 'default';
  contexts
  userMenu=  [];
  logout: string;
  profile: string;
  appSubTitle: string;
  selectedLang: string = "en";
  langs = LANGUAGE;
  lang: string = localStorage.getItem('lang') != null ? localStorage.getItem('lang') : 'en';
  logoutLabel: string;
  profileLabel: string;

  constructor(private sidebarService: NbSidebarService,
    private translate: TranslateService,
    private authService: AuthService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private breakpointService: NbMediaBreakpointsService,
    private settingService: SettingService,
    private titleService: Title,
    private router: Router) {

  }

  ngOnInit() {
    // this.translate.get('general.profile').subscribe(res => this.profile = res);
    // this.translate.get('general.logout').subscribe(res => this.logout = res);
    this.translate.get('general.appSubTitle').subscribe(res => this.appSubTitle = res);
    this.userMenu = CONTEXT_PROFILE[this.lang];
    if (localStorage.getItem('theme') != null)
      this.currentTheme = localStorage.getItem('theme');
    else
      this.currentTheme = this.themeService.currentTheme;

    this.themeService.changeTheme(this.currentTheme);
    if (localStorage.getItem('theme-icon') != null)
      this.icon = localStorage.getItem('theme-icon');

    //This line is used for dropdow context
    this.user = JSON.parse(localStorage.getItem("user")).fullname;
    this.email = JSON.parse(localStorage.getItem("user")).email;

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);


    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

      this.profileLabel = this.userMenu[0].title;
      this.logoutLabel = this.userMenu[1].title;
      this.menuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'my-context-menu'),
        map(({ item: { title } }) => title),
      ).subscribe(title => {

        if (title === this.logoutLabel){
          this.authService.logout();
        }else if (title === this.profileLabel){
          this.router.navigateByUrl('dashboard/setting-list/users/profile');
        }
      });

      this.getSetting();

      if (localStorage.getItem('lang') != null){
        this.translate.setDefaultLang(localStorage.getItem('lang'));
      }else{
        this.translate.setDefaultLang("en");
      }
      this.selectedLang = localStorage.getItem('lang');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme() {
    if (this.currentTheme ==  'default'){
      this.currentTheme = 'dark';
      this.icon = 'sun-outline';
    }
    else{
      this.currentTheme = 'default';
      this.icon = 'moon-outline';
    }
    this.themeService.changeTheme(this.currentTheme);

    localStorage.setItem('theme',this.currentTheme);
    localStorage.setItem('theme-icon',this.icon);
    // window.location.reload();
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'sidebar');
    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  ngModelDate = new Date();

  userIsSuperAdmin(): boolean{
    if(this.authService.getCurrentUser() != null){
      return this.authService.getCurrentUser().role.name == RoleEnum.SuperAdmin;
    }
    return false;
  }

  getSetting(){
    return this.settingService.getByType(SettingType.GENERAL).subscribe(
      result => {
        if (result != null){
          //Setup app title & logo
          this.title = result.appTitle;
          this.logo = result.logo;
          if (result.favicon != null) this.favIcon.href = result.favicon;
          this.translate.get('general.appSubTitle').subscribe(res =>
            this.titleService.setTitle(this.title+" - "+ res	)
            );
          // this.titleService.setTitle(this.title+" - "+this.appSubTitle);
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
      this.translate.setDefaultLang("en");
    }
    this.selectedLang = localStorage.getItem('lang')
    window.location.reload();
  }

}
