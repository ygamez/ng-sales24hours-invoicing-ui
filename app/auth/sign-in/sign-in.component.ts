import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/auth.service';
import { SocialAuthService, SocialUser } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { NbThemeService } from '@nebular/theme';
import { SettingType } from 'src/app/models/setting-type';
import { SettingService } from 'src/app/service/setting.service';
import { TranslateService } from '@ngx-translate/core';
import { LANGUAGE } from 'src/assets/translate/language';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  authForm: FormGroup;
  redirectDelay: number = 0;
  showMessages: any = {};
  strategy: string = '';
  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  submitted: boolean = false;
  loading: boolean = false;
  socialUser: SocialUser;
  loggedIn: boolean;
  enableGoogleLogin: boolean = false;
  enableFacebookLogin: boolean = false;
  cardLoading: boolean = false;
  errorMessage: string;
  wrongId: string;
  selectedLang: string = "en";
  langs = LANGUAGE;
  public applicationTitle: string;

  constructor(private _authService: AuthService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private themeService: NbThemeService,
    private socialAuthService: SocialAuthService,
    private settingService: SettingService,
    private router: Router) {
    this.authForm = this.formBuilder.group({
      email: ['owner@example.com', [Validators.required, Validators.email]],
      password: ['Password15', [Validators.required, Validators.minLength(6)]],
      rememberMe: false
    })
  }

  ngOnInit(): void {

    if (localStorage.getItem('theme') != null){
      this.themeService.changeTheme(localStorage.getItem('theme'));
    }
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.loggedIn = (user != null);
      if (this.socialUser != null && this.router.url.startsWith('/auth/sign-in')){
        let user = new User();
        user.email = this.socialUser.email;
        user.fullname = this.socialUser.firstName + " "+this.socialUser.lastName;
        user.socialLogin = true;
        this.signIn(user);
      }
    });
    this.getSocialLoginSetting();
    if (localStorage.getItem('lang') != null){
      this.translate.setDefaultLang(localStorage.getItem('lang'));
    }else{
      this.translate.setDefaultLang("en");
    }
    this.selectedLang = localStorage.getItem('lang');
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.wrongId').subscribe(res => this.wrongId = res);
    this.getSetting();
  }

  signIn(user: User){
    if (this.authForm.valid || user != null){
      this.loading = true;
      return this._authService.signIn(user).subscribe(
        result => {
          this.loading = false;
          localStorage.setItem("user", JSON.stringify(result));
          this.router.navigateByUrl('/dashboard/home');
        },error => {
          console.log(error)
          this.loading = false;
          this.showMessages.error = true;
          if (error.status === 404){
            this.errors.push(this.wrongId);
          }else{
            this.errors.push(this.errorMessage);
          }
        }
      );
    }
  }

  getSocialLoginSetting(){
    this.cardLoading = true;
    return this.settingService.getByType(SettingType.SOCIAL_LOGIN).subscribe(
      result => {
        if (result != null){
          this.enableFacebookLogin = result.enableFacebookLogin;
          this.enableGoogleLogin = result.enableGoogleLogin;
          this.cardLoading = false;
        }
      }, error => {
        console.log(error);
        this.cardLoading = false;
      }
    );
	}

  getSetting(){
    return this.settingService.getByType(SettingType.GENERAL).subscribe(
      result => {
        if (result != null){
          this.applicationTitle = result.appTitle;
        }
      }, error => {
        console.log(error);
      }
    );
	}

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  refreshToken(): void {
    this.socialAuthService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
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
