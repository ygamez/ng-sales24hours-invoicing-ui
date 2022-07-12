import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { NbAlertModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbFormFieldModule, NbIconModule, NbInputModule, NbLayoutModule, NbMenuModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';
import { SignInComponent } from '../auth/sign-in/sign-in.component';
import { SignUpComponent } from '../auth/sign-up/sign-up.component';
import { ResetPasswordComponent } from '../auth/reset-password/reset-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequestPasswordComponent } from './request-password/request-password.component';
import { HttpClientModule } from '@angular/common/http';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { SocialLoginModule } from 'angularx-social-login';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    SignInComponent,
    SignUpComponent,
    ResetPasswordComponent,
    RequestPasswordComponent,
    NotAuthorizedComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    NbAlertModule,
    FormsModule,
    ReactiveFormsModule,
    NbIconModule,
    NbCheckboxModule,
    NbInputModule,
    NbLayoutModule,
    NbCardModule,
    NbButtonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NbCardModule,
    NbSpinnerModule,
    NbMenuModule.forRoot(),
    SocialLoginModule,
    TranslateModule,
    NbSelectModule,
    NbFormFieldModule,
  ],
  providers: [
  ],
})
export class AuthModule { }
