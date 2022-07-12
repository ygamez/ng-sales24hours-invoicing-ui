import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/auth.service';
import { DateService } from 'src/app/service/date.service';
import { SocialAuthService, SocialUser } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { NbThemeService } from '@nebular/theme';
import { SettingType } from 'src/app/models/setting-type';
import { SettingService } from 'src/app/service/setting.service';
import { TranslateService } from '@ngx-translate/core';
import { LANGUAGE } from 'src/assets/translate/language';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  authForm: FormGroup;
  redirectDelay: number = 0;
  showMessages: any = {};
  strategy: string = '';
  submitted = false;
  errors: string[] = [];
  messages: string[] = [];
  loading = false;
  passwordMessage:string;
  validPassword: boolean;
  socialUser: SocialUser;
  loggedIn: boolean;
  planId: string = this.activatedRoute.snapshot.params['planId'];
  enableGoogleLogin: boolean = false;
  enableFacebookLogin: boolean = false;
  cardLoading: boolean = false;
  errorMessage: string;
  passwordRequirement: string;
  passwordRequirement1: string;
  userAlreadyExist: string;
  termAgree: string;
  selectedLang: string = "en";
  langs = LANGUAGE;

  constructor(private _authService: AuthService,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dateService: DateService,
    private themeService: NbThemeService,
    private socialAuthService: SocialAuthService,
    private settingService: SettingService,
    private router: Router) {
    this.authForm = this.formBuilder.group({
      fullname: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      agreeTerm: false,
    })
  }

  ngOnInit(): void {
    if (localStorage.getItem('theme') != null){
      this.themeService.changeTheme(localStorage.getItem('theme'));
    }
    this.socialAuthService.authState.subscribe((user) => {

      this.socialUser = user;
      this.loggedIn = (user != null);
      if (this.socialUser != null && this.router.url.startsWith('/auth/sign-up')){

        let user = new User();
        user.email = this.socialUser.email;
        user.fullname = this.socialUser.firstName + " "+this.socialUser.lastName;
        user.socialLogin = true;
        user.agreeTerm = true;
        this.validPassword = true;
        this.signUp(user);
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
    this.translate.get('general.passwordRequirement').subscribe(res => this.passwordRequirement = res);
    this.translate.get('general.passwordRequirement1').subscribe(res => this.passwordRequirement1 = res);
    this.translate.get('general.userAlreadyExist').subscribe(res => this.userAlreadyExist = res);
    this.translate.get('general.termAgree').subscribe(res => this.termAgree = res);
  }

  signUp(user: User){

    if (user != null && this.validPassword){
      if (user.agreeTerm === false) {
        this.showMessages.error = true;
        this.errors.push(this.termAgree);
        return;
      }

      user.roleId = 2;
      user.planId = 1;
      user.createdAt = user.updatedAt = this.dateService.getCurrentDate();
      user.isActive = true;
      this.loading = true;
      return this._authService.signUp(user).subscribe(
        result => {
          this.loading = false;
          this.showMessages.success = true;
          localStorage.setItem("user", JSON.stringify(result));
          if (this.planId != null && this.planId != ''){
            this.router.navigateByUrl('/dashboard/setting-list/plan/'+this.planId+'/order');
          }else{
            this.router.navigateByUrl('/dashboard/home');
          }
        },error => {
          this.loading = false;
          console.log(error);
          this.showMessages.error = true;
          if (error.status === 409){
            this.errors.push(this.userAlreadyExist);
          }else{
            this.errors.push(this.errorMessage);
          }
        }
      );
    }
  }

  onKey(value: string) {
    if (value.length < 6) {
      this.passwordMessage = this.passwordRequirement;
      this.validPassword = false;
    }else if (value.length < 6 && !this.containNumber(value)) {
      this.passwordMessage = this.passwordRequirement1;
      this.validPassword = false;

    } else if (!this.containNumber(value)) {
      this.passwordMessage = this.passwordRequirement;
      this.validPassword = false;
    }
    else {
      this.passwordMessage = "";
      this.validPassword = true;
    }
  }

  containNumber(value) {
    for (var v of value) {
      if (+v) {
        return true;
      }
    }
    return false;
  }

  onPasswordChange(event) {
    let value = event.target.value;
    if (value.lenght < 6) {
      this.passwordMessage = this.passwordRequirement;
    }
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
