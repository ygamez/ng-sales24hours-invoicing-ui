import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/auth.service';
import { DateService } from 'src/app/service/date.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  updateForm: FormGroup;
  successMessage: string;
  errorMessage: string;
  token: string = this.activatedRoute.snapshot.params["token"];
  isValidToken: boolean;
  showMessages: any = {};
  strategy: string = '';
  errors: string[] = [];
  messages: string[] = [];
  submitted: boolean = false;
  loading = false;
  helper: JwtHelperService;
  passConfirmDontMatch: string;

  constructor(private translate: TranslateService,
    private _fb: FormBuilder,
    private _authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private dateService: DateService,
    private router: Router) {
    this.updateForm = _fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
    this.helper = new JwtHelperService();
  }

  ngOnInit() {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.passConfirmDontMatch').subscribe(res => this.passConfirmDontMatch = res);
    this.checkEmailToken();
  }

  checkEmailToken() {
    if (this.token != null) {
      if (this._authService.checkRecoveryEmailToken(this.token)){
        this.router.navigateByUrl('/auth/sign-in');
      }
    }
  }

  updatePassword(data){
    if (this.updateForm.valid){
      this.loading = true;
      if (data != null && data.password == data.confirmPassword && this.token != null) {
        const email = this.helper.decodeToken(this.token).email;
        let user = new User();
        user.email = email;
        user.password = data.password;
        // user.createdAt = this.dateService.getCurrentDate();
        return this._authService.updatePassword(user, this.token).subscribe(
          () => {
            this.loading = false;
            this.router.navigateByUrl('/auth/sign-in');
          },
          error => {
            this.loading = false;
            console.log(error);
            this.showMessages.error = true;
            this.errors.push(this.errorMessage);
            this.successMessage = null;
          }
        );
      }else{
        this.showMessages.error = true;
        this.errors.push(this.passConfirmDontMatch);
      }
    }
  }

}
