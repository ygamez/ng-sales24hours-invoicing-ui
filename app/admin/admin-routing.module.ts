import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PricingCreateComponent } from './pricing-create/pricing-create.component';
import { PricingComponent } from './pricing/pricing.component';
import { SubscriptionOrderCreateComponent } from './subscription-order-create/subscription-order-create.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { UsersComponent } from './users/users.component';
import * as adminComponentConfig from './admin-components.config'
import { SettingListComponent } from './setting/setting-list/setting-list.component';
import { GeneralSettingComponent } from './setting/setting-list/general-setting/general-setting.component';
import { PaymentSettingComponent } from './setting/setting-list/payment-setting/payment-setting.component';
import { EmailSettingsComponent } from './setting/setting-list/email-settings/email-settings.component';
import { SocialSettingComponent } from './setting/setting-list/social-setting/social-setting.component';
import { InvoiceViewComponent } from '../invoice-view/invoice-view.component';
import { CurrencyCreateComponent } from './currency/currency-create/currency-create.component';
import { CurrencyListComponent } from './currency/currency-list/currency-list.component';
import { CategoryListComponent } from './category/category-list/category-list.component';
import { CategoryDetailsComponent } from './category/category-details/category-details.component';
import { CategoryCreateComponent } from './category/category-create/category-create.component';
import { TaxeListComponent } from './taxe/taxe-list/taxe-list.component';
import { TaxeDetailsComponent } from './taxe/taxe-details/taxe-details.component';
import { TaxeCreateComponent } from './taxe/taxe-create/taxe-create.component';
import { RoleListComponent } from './role/role-list.component';
import { RoleCreateComponent } from './role/create/role-create.component';
import { PermissionListComponent } from './permission/permission-list/permission-list.component';
import { PermissionCreateComponent } from './permission/permission-create/permission-create.component';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { DiscountListComponent } from './discount/discount-list/discount-list.component';
import { DiscountCreateComponent } from './discount/discount-create/discount-create.component';
import { BankAccountConnectComponent } from './bankaccount/bank-account-connect/bank-account-connect.component';
import { StripeAccountComponent } from './stripe-account/stripe-account.component';
import { PaypalSubscriptionSuccessComponent } from './subscription-order-create/paypal-subscription-success/paypal-subscription-success.component';
import { PaypalConnectReturnComponent } from './bankaccount/bank-account-connect/paypal-connect-return/paypal-connect-return.component';
import { ReportComponent } from './report/report.component';
import { ProfitAndLossComponent } from './report/profit-and-loss/profit-and-loss.component';
import { BalanceSheetComponent } from './report/balance-sheet/balance-sheet.component';
import { CashFlowComponent } from './report/cash-flow/cash-flow.component';
import { SalesTaxComponent } from './report/sales-tax/sales-tax.component';
import { CustomerSalesComponent } from './report/customer-sales/customer-sales.component';
import { VendorPurchasesComponent } from './report/vendor-purchases/vendor-purchases.component';
import { AccountBalancesComponent } from './report/account-balances/account-balances.component';
import { TrialBalancesComponent } from './report/trial-balances/trial-balances.component';
import { AccountTransactionsComponent } from './report/account-transactions/account-transactions.component';
import { CompanyComponent } from './company/company.component';
import { StripeConnectReturnComponent } from './bankaccount/bank-account-connect/stripe-connect-return/stripe-connect-return.component';
import { NotAuthorizedComponent } from '../auth/not-authorized/not-authorized.component';
import { SubscriptionGuard } from './subscription.guard';
import { SuccessfulSubscriptionComponent } from './successful-subscription/successful-subscription.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { InvoiceCustomizationComponent } from './setting/setting-list/invoice-customization/invoice-customization.component';
import { UserCloseAccountComponent } from './user-close-account/user-close-account.component';
import { SocialLoginComponent } from './setting/setting-list/social-login/social-login.component';
import { LicenseComponent } from './setting/setting-list/license/license.component';
import { LicenseGuard } from './setting/guard/license.guard';

const routes: Routes = [
  {path:'', component: AdminComponent, children: [
    {
      path:'home',
      component: DashboardComponent,
      canActivate: [AuthGuard],
      data: {permittedRoles:['SuperAdmin','Admin', 'User', 'SuperUser','Viewer']}
    },
    {
      path:'bank-account/connect',
      component: BankAccountConnectComponent,
      canActivate: [AuthGuard],
      data: {permittedRoles:['SuperAdmin','Admin']}
    },
    {
      path:'bank-account/paypal/connect/return-url',
      component: PaypalConnectReturnComponent,
      canActivate: [AuthGuard],
      data: {permittedRoles:['SuperAdmin','Admin']}
    },
    {
      path:'bank-account/paypal/connect/renewal-url',
      component: PaypalConnectReturnComponent,
      canActivate: [AuthGuard],
      data: {permittedRoles:['SuperAdmin','Admin']}
    },
    {
      path:'bank-account/connect/return-url',
      component: BankAccountConnectComponent,
      canActivate: [AuthGuard],
      data: {permittedRoles:['SuperAdmin','Admin']}
    },
    {
      path:'bank-account/stripe/connect/return-url',
      component: StripeConnectReturnComponent,
      canActivate: [AuthGuard],
      data: {permittedRoles:['SuperAdmin','Admin']}
    },
    {
      path:'subscriptions/success',
      component: PaypalSubscriptionSuccessComponent,
      canActivate: [AuthGuard],
      data: {permittedRoles:['SuperAdmin','Admin', 'SuperUser']}
    },
    {
      path:'subscriptions/checkout-success',
      component: SuccessfulSubscriptionComponent,
      canActivate: [AuthGuard],
      data: {permittedRoles:['SuperAdmin','Admin', 'SuperUser']}
    },
    {
      path: '401-unauthorized',
      component: NotAuthorizedComponent,
      canActivate: [AuthGuard],
      data: {permittedRoles:['SuperAdmin','Admin', 'User', 'SuperUser','Viewer']}
    },
    {
      path: 'reports',
      component: ReportComponent,
      canActivate: [AuthGuard],
      data: {permittedRoles:['SuperAdmin','Admin', 'User', 'SuperUser','Viewer']},
      children:[
        {
          path: 'profit-and-loss',
          component: ProfitAndLossComponent,
        },
        {
          path: 'balance-sheet',
          component: BalanceSheetComponent,
        },
        {
          path: 'chash-flow',
          component: CashFlowComponent,
        },
        {
          path: 'taxes-sales',
          component: SalesTaxComponent,
        },
        {
          path: 'customers-sales',
          component: CustomerSalesComponent,
        },
        {
          path: 'vendors-purchases',
          component: VendorPurchasesComponent,
        },
        {
          path: 'account-balances',
          component: AccountBalancesComponent,
        },
        {
          path: 'trial-balances',
          component: TrialBalancesComponent,
        },
        {
          path: 'account-transactions',
          component: AccountTransactionsComponent,
        },
      ]
    },
    {
      path: 'setting-list',
      component: SettingListComponent,
      children:[
        {
          path: 'category-list',
          component: CategoryListComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin','Admin', 'SuperUser', 'User', 'Viewer']}
        },
        {
          path: 'category/details/:id',
          component: CategoryDetailsComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin','Admin', 'SuperUser']}
        },
        {
          path: 'category/edit/:id',
          component: CategoryCreateComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin','Admin', 'SuperUser']}
        },
        {
          path: 'category/create',
          component: CategoryCreateComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin','Admin', 'SuperUser']}
        },
        {
          path: 'taxes',
          component: TaxeListComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin','Admin', 'SuperUser']}
        },
        {
          path: 'taxes/details/:id',
          component: TaxeDetailsComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin','Admin', 'SuperUser']}
        },
        {
          path: 'taxes/edit/:id',
          component: TaxeCreateComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin','Admin', 'SuperUser']}
        },
        {
          path: 'taxes/create',
          component: TaxeCreateComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin','Admin', 'SuperUser']}
        },
        {
          path:'users',
          component: UsersComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin', 'Admin']}
        },
        {
          path:'users/create',
          component: UserCreateComponent,
          canActivate: [AuthGuard,SubscriptionGuard],
          data: {permittedRoles:['SuperAdmin', 'Admin']}
        },
        {
          path:'users/edit/:id',
          component: UserCreateComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin', 'Admin']}
        },
        {
          path:'users/profile',
          component: UserProfileComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser', 'User', 'Viewer']}
        },
        {
          path:'users/account/close',
          component: UserCloseAccountComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin', 'Admin']}
        },
        {
          path:'pricings',
          component: PricingComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser', 'User', 'Viewer']}
        },
        {
          path:'subscriptions',
          component: SubscriptionsComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser', 'User', 'Viewer']}
        },
        {
          path:'plan/:planId/order',
          component: SubscriptionOrderCreateComponent,
          canActivate: [AuthGuard, LicenseGuard],
          data: {permittedRoles:['SuperAdmin','Admin']}
        },
        {
          path: 'currencies/create',
          component: CurrencyCreateComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser']}
        },
        {
          path: 'currencies/edit/:id',
          component: CurrencyCreateComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser']}
        },
        {
          path: 'currencies',
          component: CurrencyListComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser', 'User', 'Viewer']}
        },
        {
          path: 'invoice/customization',
          component: InvoiceCustomizationComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser', 'User']}
        },
        {
          path: 'company',
          component: CompanyComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser', 'User']}
        },
      ]
    },
    {
      path: 'super-admin-console',
      component: SuperAdminComponent,
      children: [
        {
          path:'home',
          component: SocialSettingComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin']}
        },
        {
          path:'users',
          component: UsersComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin']}
        },
        {
          path:'stripe-accounts',
          component: StripeAccountComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin']}
        },
        {
          path:'users/edit/:id',
          component: UserCreateComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin']}
        },
        {
          path:'users/create',
          component: UserCreateComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin']}
        },
        {
          path:'pricings',
          component: PricingComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin']}
        },
        {
          path:'pricings/user/:userId/assign',
          component: PricingComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin']}
        },
        {
          path:'subscriptions',
          component: SubscriptionsComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin']}
        },
        {
          path:'pricings/create',
          component: PricingCreateComponent,
          canActivate: [AuthGuard, LicenseGuard],
          data: {permittedRoles:['SuperAdmin']},
        },
        {
          path:'pricings/edit/:id',
          component: PricingCreateComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin']},
        },
        {
          path: 'taxes',
          component: TaxeListComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin']}
        },
        {
          path: 'taxes/details/:id',
          component: TaxeDetailsComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin']}
        },
        {
          path: 'taxes/edit/:id',
          component: TaxeCreateComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin']}
        },
        {
          path: 'taxes/create',
          component: TaxeCreateComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin']}
        },
        {
          path:'general-settings',
          component: GeneralSettingComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin']}
        },
        {
          path:'payment-settings',
          component: PaymentSettingComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin']}
        },
        {
          path:'social-login',
          component: SocialLoginComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin']}
        },
        {
          path: 'currencies/create',
          component: CurrencyCreateComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin']}
        },
        {
          path: 'currencies/edit/:id',
          component: CurrencyCreateComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin']}
        },
        {
          path: 'currencies',
          component: CurrencyListComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin']}
        },
        {
          path:'email-settings',
          component: EmailSettingsComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin']}
        },
        {
          path:'social-settings',
          component: SocialSettingComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin']}
        },
        {
          path:'license-settings',
          component: SocialSettingComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin']}
        },
        {
          path:'discounts',
          component: DiscountListComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin']}
        },
        {
          path:'discounts/create',
          component: DiscountCreateComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin']}
        },
        {
          path:'discounts/edit/:id',
          component: DiscountCreateComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin']}
        },
        {
          path:'license',
          component: LicenseComponent,
          canActivate: [AuthGuard],
          data: {permittedRoles:['SuperAdmin']}
        },
      ]
    },
    ...adminComponentConfig.routes
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
