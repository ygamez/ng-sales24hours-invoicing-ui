import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './partial/sidebar/sidebar.component';
import { AdminComponent } from './admin.component';
import {
  NbAccordionModule,
  NbActionsModule,
  NbAlertModule,
  NbButtonModule,
  NbCalendarModule,
  NbCalendarRangeModule,
  NbCardModule,
  NbCheckboxModule,
  NbContextMenuModule,
  NbDatepickerModule,
  NbDialogModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbMenuModule,
  NbProgressBarModule,
  NbRadioModule,
  NbSearchModule,
  NbSelectModule,
  NbSidebarModule,
  NbSpinnerModule,
  NbStepperModule,
  NbTabsetModule,
  NbThemeModule,
  NbToastrModule,
  NbToastrService,
  NbToggleModule,
  NbTooltipModule,
  NbTreeGridModule,
  NbUserModule,
  NB_TIME_PICKER_CONFIG
} from '@nebular/theme';
import { HeaderComponent } from './partial/header/header.component';
import { FooterComponent } from './partial/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { LineChartJsComponent } from './dashboard/partial/line-chart-js/line-chart-js.component';
import { PieEchartComponent } from './dashboard/partial/pie-echart/pie-echart.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { ChartModule } from 'angular2-chartjs';
import * as echarts from 'echarts';
import { ChannelsTraficComponent } from './dashboard/partial/channels-trafic/channels-trafic.component';
import { PageViewComponent } from './dashboard/partial/page-view/page-view.component';
import { BestCustomersComponent } from './dashboard/partial/best-customers/best-customers.component';
import { BestSellingProductComponent } from './dashboard/partial/best-selling-product/best-selling-product.component';
import { PricingComponent } from './pricing/pricing.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { UsersComponent } from './users/users.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PricingCreateComponent } from './pricing-create/pricing-create.component';
import { SubscriptionOrderCreateComponent } from './subscription-order-create/subscription-order-create.component';
import { environment } from 'src/environments/environment';
import { NgxStripeModule } from 'ngx-stripe';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import * as adminComponentConfig  from './admin-components.config';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdSortableHeader } from '../directive/sortable.directive';
import { GeneralSettingComponent } from './setting/setting-list/general-setting/general-setting.component';
import { SettingListComponent } from './setting/setting-list/setting-list.component';
import { PaymentSettingComponent } from './setting/setting-list/payment-setting/payment-setting.component';
import { EmailSettingsComponent } from './setting/setting-list/email-settings/email-settings.component';
import { SocialSettingComponent } from './setting/setting-list/social-setting/social-setting.component';
import { NbMomentDateModule } from '@nebular/moment';
import { InvoiceItemCreateComponent } from './invoice/invoice-create/invoice-item-create/invoice-item-create.component';
import { ProposalItemCreateComponent } from './proposal/proposal-create/proposal-item-create/proposal-item-create.component';
import { ManualJournalCreateComponent } from './manualjournal/manualjournal-create/manualjournal-create.component';
import { ManualJournalDetailsComponent } from './manualjournal/manualjournal-details/manualjournal-details.component';
import { ManualJournalListComponent } from './manualjournal/manualjournal-list/manualjournal-list.component';
import { ManualJournalItemCreateComponent } from './manualjournal/manualjournal-create/manual-journal-item-create/manual-journal-item-create.component';
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { CurrencyCreateComponent } from './currency/currency-create/currency-create.component';
import { CurrencyListComponent } from './currency/currency-list/currency-list.component';
import { CurrencyDetailsComponent } from './currency/currency-details/currency-details.component';
import { PermissionCreateComponent } from './permission/permission-create/permission-create.component';
import { PermissionListComponent } from './permission/permission-list/permission-list.component';
import { RoleListComponent } from './role/role-list.component';
import { RoleCreateComponent } from './role/create/role-create.component';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { SuperAdminDashboardComponent } from './super-admin/super-admin-dashboard/super-admin-dashboard.component';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DiscountListComponent } from './discount/discount-list/discount-list.component';
import { DiscountCreateComponent } from './discount/discount-create/discount-create.component';
import { DiscountDetailsComponent } from './discount/discount-details/discount-details.component';
import { BankAccountConnectComponent } from './bankaccount/bank-account-connect/bank-account-connect.component';
import { StripeAccount } from '../models/stripe-account';
import { StripeAccountComponent } from './stripe-account/stripe-account.component';
import { ReceiptSendingDialogComponent } from './invoice/invoice-details/receipt-sending-dialog/receipt-sending-dialog.component';
import { PdfInvoiceComponent } from '../template/pdf-invoice/pdf-invoice.component';
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
import { ChartsPanelComponent } from './dashboard/partial/charts-panel/charts-panel.component';
import { ProfitChartComponent } from './dashboard/partial/charts-panel/charts/profit-chart.component';
import { OrdersChartComponent } from './dashboard/partial/charts-panel/charts/orders-chart.component';
import { ChartPanelSummaryComponent } from './dashboard/partial/charts-panel/chart-panel-summary/chart-panel-summary.component';
import { ChartPanelHeaderComponent } from './dashboard/partial/charts-panel/chart-panel-header/chart-panel-header.component';
import { LineEchartComponent } from './dashboard/partial/line-echart/line-echart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CompanyComponent } from './company/company.component';
import { StripeConnectReturnComponent } from './bankaccount/bank-account-connect/stripe-connect-return/stripe-connect-return.component';
import { RecurringInvoicesComponent } from './invoice/recurring-invoices/recurring-invoices.component';
import { TranslateModule } from '@ngx-translate/core';
import { SuccessfulSubscriptionComponent } from './successful-subscription/successful-subscription.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { InvoiceCustomizationComponent } from './setting/setting-list/invoice-customization/invoice-customization.component';
import { UserCloseAccountComponent } from './user-close-account/user-close-account.component';
import { SocialLoginComponent } from './setting/setting-list/social-login/social-login.component';
import { LicenseComponent } from './setting/setting-list/license/license.component';
import { InvoiceTableComponent } from './invoice/invoice-list/invoice-table/invoice-table.component';

const declarations: any[] = [
  DashboardComponent,
  SidebarComponent,
  AdminComponent,
  HeaderComponent,
  FooterComponent,
  LineChartJsComponent,
  PieEchartComponent,
  ChannelsTraficComponent,
  PageViewComponent,
  BestCustomersComponent,
  BestSellingProductComponent,
  PricingComponent,
  UsersComponent,
  UserCreateComponent,
  PricingCreateComponent,
  SubscriptionOrderCreateComponent,
  SubscriptionsComponent,
  NgbdSortableHeader,
	SettingListComponent,
  GeneralSettingComponent,
  PaymentSettingComponent,
  SocialSettingComponent,
  EmailSettingsComponent,
  InvoiceItemCreateComponent,
  ProposalItemCreateComponent,
  ManualJournalCreateComponent,
  ManualJournalDetailsComponent,
  ManualJournalListComponent,
  DeleteConfirmationComponent,
  ManualJournalItemCreateComponent,
  CurrencyCreateComponent,
  CurrencyListComponent,
  CurrencyDetailsComponent,
  PermissionCreateComponent,
  PermissionListComponent,
  RoleListComponent,
  RoleCreateComponent,
  SuperAdminComponent,
  SuperAdminDashboardComponent,
  DiscountListComponent,
  DiscountCreateComponent,
  DiscountDetailsComponent,
  BankAccountConnectComponent,
  StripeAccountComponent,
  ReceiptSendingDialogComponent,
  PaypalConnectReturnComponent,
  StripeConnectReturnComponent,
  ReportComponent,
  ProfitAndLossComponent,
  BalanceSheetComponent,
  CashFlowComponent,
  SalesTaxComponent,
  CustomerSalesComponent,
  VendorPurchasesComponent,
  AccountBalancesComponent,
  TrialBalancesComponent,
  AccountTransactionsComponent,
  ChartsPanelComponent,
  ProfitChartComponent,
  OrdersChartComponent,
  ChartPanelSummaryComponent,
  ChartPanelHeaderComponent,
  LineEchartComponent,
  CompanyComponent,
  RecurringInvoicesComponent,
  SuccessfulSubscriptionComponent,
  UserProfileComponent,
  InvoiceCustomizationComponent,
  UserCloseAccountComponent,
  SocialLoginComponent,
  LicenseComponent,
  InvoiceTableComponent,
  ...adminComponentConfig.declarations
]

@NgModule({
  declarations: declarations,
  imports: [
    CommonModule,
    AdminRoutingModule,
    NbLayoutModule,
    NbMenuModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbActionsModule,
    NbDatepickerModule.forRoot(),
    NbSearchModule,
    NbUserModule,
    NbContextMenuModule,
    NbIconModule,
    NbEvaIconsModule,
    NbSelectModule,
    NbInputModule,
    HttpClientModule,
    NbCardModule,
    NgxEchartsModule.forRoot({ echarts }),
    ChartModule,
    NbButtonModule,
    NbCheckboxModule,
    NbFormFieldModule,
    NbStepperModule,
    NbSpinnerModule,
    NbDialogModule.forRoot(),
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    NbToastrModule.forRoot(),
    NbToggleModule,
    NgxStripeModule.forRoot(),
    NbRadioModule,
    NbAccordionModule,
    NbProgressBarModule,
    NbTabsetModule,
    NbAlertModule,
    NbListModule,
    NbCalendarModule,
    NbCalendarRangeModule,
    NgxChartsModule,
    NbTooltipModule,
    TranslateModule
  ],
  providers: [
    NbToastrService,
    DatePipe,
    { provide:NB_TIME_PICKER_CONFIG, useValue:{} }
  ],
})
export class AdminModule { }
