import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/auth.service';
import { DateService } from 'src/app/service/date.service';

@Component({
  selector: 'app-request-password',
  templateUrl: './request-password.component.html',
  styleUrls: ['./request-password.component.scss']
})
export class RequestPasswordComponent implements OnInit {
  rqpForm: FormGroup;
  showMessages: any = {};
  strategy: string = '';
  errors: string[] = [];
  messages: string[] = [];
  submitted = false;
  loading = false;
  noAccountExist: string;
  deletedItem: string;
  errorMessage: string;
  activationLinkSent: string;

  constructor(private _authService: AuthService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private dateService: DateService,
    private router: Router) {
    this.rqpForm = this.formBuilder.group({
      email: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
    this.translate.get('general.noAccountExist').subscribe(res => this.noAccountExist = res);
    this.translate.get('general.activationLinkSent').subscribe(res => this.activationLinkSent = res);
  }

  requestPassword(user: User){
    if (this.rqpForm.valid){
      user.currentUrl = window.location.origin
      this.loading = true;
      return this._authService.sendRecoveryLink(user).subscribe(
        result => {
          this.loading = false;
          localStorage.setItem('recovery-email', result.email);
          this.showMessages.success = true;
          this.messages.push(this.activationLinkSent)
        },
        error => {
          this.loading = false;
          console.log(error);
          this.showMessages.error = true;
          if (error.status == 404) {
            this.errors.push(this.noAccountExist);
          }else{
            this.errors.push(this.errorMessage);
            // this.errors.push("Setup your SMTP Configuration to allow this feature.");
          }
        }
      )
    }

  }

}
