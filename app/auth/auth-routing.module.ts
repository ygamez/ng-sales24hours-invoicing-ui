import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceViewComponent } from '../invoice-view/invoice-view.component';
import { NotAuthorizedComponent } from './not-authorized/not-authorized.component';
import { RequestPasswordComponent } from './request-password/request-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';


const routes: Routes = [
  {path: 'sign-in', component: SignInComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'sign-up/plan/:planId', component: SignUpComponent},
  {path: 'request-password', component: RequestPasswordComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: 'reset-password/:token', component: ResetPasswordComponent},
  {path: '401-unauthorized', component: NotAuthorizedComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
