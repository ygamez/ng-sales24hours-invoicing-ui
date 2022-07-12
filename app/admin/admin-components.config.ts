import { AssetsListComponent } from '../admin/assets/assets-list/assets-list.component';
import { AssetsCreateComponent } from '../admin/assets/assets-create/assets-create.component';
import { AssetsDetailsComponent } from '../admin/assets/assets-details/assets-details.component';
import { BankAccountListComponent } from '../admin/bankaccount/bankaccount-list/bankaccount-list.component';
import { BankAccountCreateComponent } from '../admin/bankaccount/bankaccount-create/bankaccount-create.component';
import { BankAccountDetailsComponent } from '../admin/bankaccount/bankaccount-details/bankaccount-details.component';
import { BillListComponent } from '../admin/bill/bill-list/bill-list.component';
import { BillCreateComponent } from '../admin/bill/bill-create/bill-create.component';
import { BillDetailsComponent } from '../admin/bill/bill-details/bill-details.component';
import { CategoryListComponent } from '../admin/category/category-list/category-list.component';
import { CategoryCreateComponent } from '../admin/category/category-create/category-create.component';
import { CategoryDetailsComponent } from '../admin/category/category-details/category-details.component';
import { ChartAccountsListComponent } from '../admin/chartaccounts/chartaccounts-list/chartaccounts-list.component';
import { ChartAccountsCreateComponent } from '../admin/chartaccounts/chartaccounts-create/chartaccounts-create.component';
import { ChartAccountsDetailsComponent } from '../admin/chartaccounts/chartaccounts-details/chartaccounts-details.component';
import { CreditNoteListComponent } from '../admin/creditnote/creditnote-list/creditnote-list.component';
import { CreditNoteCreateComponent } from '../admin/creditnote/creditnote-create/credit-note-create.component';
import { CreditNoteDetailsComponent } from '../admin/creditnote/creditnote-details/creditnote-details.component';
import { CustomerListComponent } from '../admin/customer/customer-list/customer-list.component';
import { CustomerCreateComponent } from '../admin/customer/customer-create/customer-create.component';
import { CustomerDetailsComponent } from '../admin/customer/customer-details/customer-details.component';
import { DebitNoteListComponent } from '../admin/debitnote/debitnote-list/debitnote-list.component';
import { DebitNoteCreateComponent } from '../admin/debitnote/debitnote-create/debitnote-create.component';
import { DebitNoteDetailsComponent } from '../admin/debitnote/debitnote-details/debitnote-details.component';
import { GoalListComponent } from '../admin/goal/goal-list/goal-list.component';
import { GoalCreateComponent } from '../admin/goal/goal-create/goal-create.component';
import { GoalDetailsComponent } from '../admin/goal/goal-details/goal-details.component';
import { InvoiceListComponent } from '../admin/invoice/invoice-list/invoice-list.component';
import { InvoiceCreateComponent } from '../admin/invoice/invoice-create/invoice-create.component';
import { InvoiceDetailsComponent } from '../admin/invoice/invoice-details/invoice-details.component';
import { PaymentListComponent } from '../admin/payment/payment-list/payment-list.component';
import { PaymentCreateComponent } from '../admin/payment/payment-create/payment-create.component';
import { PaymentDetailsComponent } from '../admin/payment/payment-details/payment-details.component';
import { ProductListComponent } from '../admin/product/product-list/product-list.component';
import { ProductCreateComponent } from '../admin/product/product-create/product-create.component';
import { ProductDetailsComponent } from '../admin/product/product-details/product-details.component';
import { ProposalListComponent } from '../admin/proposal/proposal-list/proposal-list.component';
import { ProposalCreateComponent } from '../admin/proposal/proposal-create/proposal-create.component';
import { ProposalDetailsComponent } from '../admin/proposal/proposal-details/proposal-details.component';
import { RevenueListComponent } from '../admin/revenue/revenue-list/revenue-list.component';
import { RevenueCreateComponent } from '../admin/revenue/revenue-create/revenue-create.component';
import { RevenueDetailsComponent } from '../admin/revenue/revenue-details/revenue-details.component';
import { ServiceListComponent } from '../admin/service/service-list/service-list.component';
import { ServiceCreateComponent } from '../admin/service/service-create/service-create.component';
import { ServiceDetailsComponent } from '../admin/service/service-details/service-details.component';
import { SettingListComponent } from '../admin/setting/setting-list/setting-list.component';
import { SettingCreateComponent } from '../admin/setting/setting-create/setting-create.component';
import { SettingDetailsComponent } from '../admin/setting/setting-details/setting-details.component';
import { TaxeListComponent } from '../admin/taxe/taxe-list/taxe-list.component';
import { TaxeCreateComponent } from '../admin/taxe/taxe-create/taxe-create.component';
import { TaxeDetailsComponent } from '../admin/taxe/taxe-details/taxe-details.component';
import { TransactionListComponent } from '../admin/transaction/transaction-list/transaction-list.component';
import { TransactionCreateComponent } from '../admin/transaction/transaction-create/transaction-create.component';
import { TransactionDetailsComponent } from '../admin/transaction/transaction-details/transaction-details.component';
import { TransferListComponent } from '../admin/transfer/transfer-list/transfer-list.component';
import { TransferCreateComponent } from '../admin/transfer/transfer-create/transfer-create.component';
import { TransferDetailsComponent } from '../admin/transfer/transfer-details/transfer-details.component';
import { VendorListComponent } from '../admin/vendor/vendor-list/vendor-list.component';
import { VendorCreateComponent } from '../admin/vendor/vendor-create/vendor-create.component';
import { VendorDetailsComponent } from '../admin/vendor/vendor-details/vendor-details.component';
import { GeneralSettingComponent } from './setting/setting-list/general-setting/general-setting.component';
import { AuthGuard } from '../auth/auth.guard';
import { BillItemCreateComponent } from './bill/bill-create/bill-item-create/bill-item-create.component';
import { ManualJournalListComponent } from './manualjournal/manualjournal-list/manualjournal-list.component';
import { ManualJournalDetailsComponent } from './manualjournal/manualjournal-details/manualjournal-details.component';
import { ManualJournalCreateComponent } from './manualjournal/manualjournal-create/manualjournal-create.component';
import { RecurringInvoicesComponent } from './invoice/recurring-invoices/recurring-invoices.component';
import { ReconciliationComponent } from './reconciliation/reconciliation.component';
import { SubscriptionGuard } from './subscription.guard';

export const declarations = [
	AssetsListComponent,
	AssetsDetailsComponent,
	AssetsCreateComponent,
	BankAccountListComponent,
	BankAccountDetailsComponent,
	BankAccountCreateComponent,
	BillListComponent,
	BillDetailsComponent,
	BillCreateComponent,
  BillItemCreateComponent,
	CategoryListComponent,
	CategoryDetailsComponent,
	CategoryCreateComponent,
	ChartAccountsListComponent,
	ChartAccountsDetailsComponent,
	ChartAccountsCreateComponent,
	CreditNoteListComponent,
	CreditNoteDetailsComponent,
	CreditNoteCreateComponent,
	CustomerListComponent,
	CustomerDetailsComponent,
	CustomerCreateComponent,
	DebitNoteListComponent,
	DebitNoteDetailsComponent,
	DebitNoteCreateComponent,
	GoalListComponent,
	GoalDetailsComponent,
	GoalCreateComponent,
	InvoiceListComponent,
	InvoiceDetailsComponent,
	InvoiceCreateComponent,
	PaymentListComponent,
	PaymentDetailsComponent,
	PaymentCreateComponent,
	ProductListComponent,
	ProductDetailsComponent,
	ProductCreateComponent,
	ProposalListComponent,
	ProposalDetailsComponent,
	ProposalCreateComponent,
	RevenueListComponent,
	RevenueDetailsComponent,
	RevenueCreateComponent,
	ServiceListComponent,
	ServiceDetailsComponent,
	ServiceCreateComponent,
	SettingDetailsComponent,
	SettingCreateComponent,
	TaxeListComponent,
	TaxeDetailsComponent,
	TaxeCreateComponent,
	TransactionListComponent,
	TransactionDetailsComponent,
	TransactionCreateComponent,
	TransferListComponent,
	TransferDetailsComponent,
	TransferCreateComponent,
	VendorListComponent,
	VendorDetailsComponent,
	VendorCreateComponent
]

export const routes = [
	{
		path: 'assets-list',
		component: AssetsListComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser', 'User', 'Viewer']}
	},
	{
		path: 'assets/details/:id',
		component: AssetsDetailsComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser', 'User', 'Viewer']}
	},
	{
		path: 'assets/edit/:id',
		component: AssetsCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser', 'User']}
	},
	{
		path: 'assets/create',
		component: AssetsCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser', 'User']}
	},
	{
		path: 'bank-account-list',
		component: BankAccountListComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser']}
	},
	{
		path: 'bank-account/details/:id',
		component: BankAccountDetailsComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser']}
	},
	{
		path: 'bank-account/edit/:id',
		component: BankAccountCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin']}
	},
	{
		path: 'bank-account/create',
		component: BankAccountCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin']}
	},
	{
		path: 'bill-list',
		component: BillListComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser', 'User', 'Viewer']}
	},
	{
		path: 'bill/details/:id',
		component: BillDetailsComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser', 'User', 'Viewer']}
	},
	{
		path: 'bill/edit/:id',
		component: BillCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser', 'User']}
	},
	{
		path: 'bill/create',
		component: BillCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser', 'User']}
	},
	{
		path: 'chart-accounts-list',
		component: ChartAccountsListComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser', 'User', 'Viewer']}
	},
	{
		path: 'chart-accounts/details/:id',
		component: ChartAccountsDetailsComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser', 'User', 'Viewer']}
	},
	{
		path: 'chart-accounts/edit/:id',
		component: ChartAccountsCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser', 'User']}
	},
	{
		path: 'chart-accounts/create',
		component: ChartAccountsCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser', 'User']}
	},
	{
		path: 'credit-note-list',
		component: CreditNoteListComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser', 'User', 'Viewer']}
	},
	{
		path: 'credit-note/details/:id',
		component: CreditNoteDetailsComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser', 'User', 'Viewer']}
	},
  {
		path: 'invoice/:invoiceId/credit-note/create',
		component: CreditNoteCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser']}
	},
	{
		path: 'credit-note/edit/:id',
		component: CreditNoteCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser']}
	},
	{
		path: 'credit-note/create',
		component: CreditNoteCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser']}
	},
	{
		path: 'customer-list',
		component: CustomerListComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser', 'Viewer']}
	},
	{
		path: 'customer/details/:id',
		component: CustomerDetailsComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser', 'Viewer']}
	},
	{
		path: 'customer/edit/:id',
		component: CustomerCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser']}
	},
	{
		path: 'customer/create',
		component: CustomerCreateComponent,
    canActivate: [AuthGuard, SubscriptionGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser']}
	},
	{
		path: 'debit-note-list',
		component: DebitNoteListComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser', 'Viewer']}
	},
	{
		path: 'debit-note/details/:id',
		component: DebitNoteDetailsComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser', 'Viewer']}
	},
	{
		path: 'debit-note/edit/:id',
		component: DebitNoteCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser']}
	},
  {
		path: 'bill/:billId/debit-note/create',
		component: DebitNoteCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser']}
	},
	{
		path: 'debit-note/create',
		component: DebitNoteCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser']}
	},
	{
		path: 'goal-list',
		component: GoalListComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser', 'Viewer']}
	},
	{
		path: 'goal/details/:id',
		component: GoalDetailsComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser', 'Viewer']}
	},
	{
		path: 'goal/edit/:id',
		component: GoalCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser']}
	},
	{
		path: 'goal/create',
		component: GoalCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser']}
	},
	{
		path: 'invoice-list',
		component: InvoiceListComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser', 'Viewer']}
	},
	{
		path: 'invoice/details/:id',
		component: InvoiceDetailsComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser', 'Viewer']}
	},
	{
		path: 'invoice/edit/:id',
		component: InvoiceCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser']}
	},
	{
		path: 'invoice/create',
		component: InvoiceCreateComponent,
    canActivate: [AuthGuard, SubscriptionGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser']}
	},
  {
		path: 'recurring-invoices',
		component: RecurringInvoicesComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser']}
	},
  {
		path: 'recurring-invoices/edit/:id',
		component: RecurringInvoicesComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser']}
	},
	{
		path: 'payment-list',
		component: PaymentListComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser', 'Viewer']}
	},
	{
		path: 'payment/details/:id',
		component: PaymentDetailsComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser', 'Viewer']}
	},
	{
		path: 'payment/edit/:id',
		component: PaymentCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser']}
	},
  {
		path: 'bill/:billId/pay',
		component: PaymentCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser']}
	},
	{
		path: 'payment/create',
		component: PaymentCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser', 'User']}
	},
	{
		path: 'product-list',
		component: ProductListComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser', 'Viewer']}
	},
	{
		path: 'product/details/:id',
		component: ProductDetailsComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser', 'Viewer']}
	},
	{
		path: 'product/edit/:id',
		component: ProductCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser']}
	},
	{
		path: 'product/create',
		component: ProductCreateComponent,
    canActivate: [AuthGuard,SubscriptionGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser']}
	},
	{
		path: 'proposal-list',
		component: ProposalListComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser', 'Viewer']}
	},
	{
		path: 'proposal/details/:id',
		component: ProposalDetailsComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser', 'Viewer']}
	},
	{
		path: 'proposal/edit/:id',
		component: ProposalCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser']}
	},
	{
		path: 'proposal/create',
		component: ProposalCreateComponent,
    canActivate: [AuthGuard, SubscriptionGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser']}
	},
	{
		path: 'revenue-list',
		component: RevenueListComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser', 'Viewer']}
	},
	{
		path: 'revenue/details/:id',
		component: RevenueDetailsComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser', 'Viewer']}
	},
	{
		path: 'revenue/edit/:id',
		component: RevenueCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser']}
	},
	{
		path: 'revenue/create',
		component: RevenueCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser', 'User']}
	},
  {
		path: 'invoice/:invoiceId/pay',
		component: RevenueCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser',]}
	},
	{
		path: 'service-list',
		component: ServiceListComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser', 'Viewer']}
	},
	{
		path: 'service/details/:id',
		component: ServiceDetailsComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser', 'Viewer']}
	},
	{
		path: 'service/edit/:id',
		component: ServiceCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser']}
	},
	{
		path: 'service/create',
		component: ServiceCreateComponent,
    canActivate: [AuthGuard,SubscriptionGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser']}
	},
	{
		path: 'transaction-list',
		component: TransactionListComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser','Viewer']}
	},
	{
		path: 'transaction/details/:id',
		component: TransactionDetailsComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser','Viewer']}
	},
	{
		path: 'transaction/edit/:id',
		component: TransactionCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser']}
	},
	{
		path: 'transaction/create',
		component: TransactionCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser']}
	},
	{
		path: 'transfer-list',
		component: TransferListComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser','Viewer']}
	},
	{
		path: 'transfer/details/:id',
		component: TransferDetailsComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser']}
	},
	{
		path: 'transfer/create',
		component: TransferCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'SuperUser']}
	},
	{
		path: 'vendor-list',
		component: VendorListComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser','Viewer']}
	},
	{
		path: 'vendor/details/:id',
		component: VendorDetailsComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser','Viewer']}
	},
	{
		path: 'vendor/edit/:id',
		component: VendorCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser']}
	},
	{
		path: 'vendor/create',
		component: VendorCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser']}
	},
  {
		path: 'manual-journal-list',
		component: ManualJournalListComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser','Viewer']}
	},
	{
		path: 'manual-journal/details/:id',
		component: ManualJournalDetailsComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser', 'Viewer']}
	},
	{
		path: 'manual-journal/edit/:id',
		component: ManualJournalCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser']}
	},
	{
		path: 'manual-journal/create/:lastManualJournalId',
		component: ManualJournalCreateComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser']}
	},
  {
		path: 'reconciliation',
		component: ReconciliationComponent,
    canActivate: [AuthGuard],
    data: {permittedRoles:['SuperAdmin', 'Admin', 'User', 'SuperUser', 'Viewer']}
	},
]

export const menuItems = [
  {
    title: 'Sales & Expenses',
    group: true,
  },
  {
    title: 'Sales',
    icon: 'credit-card-outline',
    children: [
      {
        title: 'Estimates',
        link: '/dashboard/proposal-list',
      },
      {
        title: 'Invoices',
        link: '/dashboard/invoice-list',
      },
      {
        title: 'Recurring invoices',
        link: '/dashboard/recurring-invoices',
      },
      {
        title: 'Incomes',
        link: '/dashboard/revenue-list',
      },
      {
        title: 'Credit notes',
        link: '/dashboard/credit-note-list',
      },
      {
        title: 'Customers',
        link: '/dashboard/customer-list',
      },
    ]
  },
  {
    title:'Expenses',
    icon:'credit-card-outline',
    children:[
      {
        title: 'Bills',
        link: '/dashboard/bill-list',
      },
      {
        title: 'Expenses',
        link: '/dashboard/payment-list',
      },
      {
        title: 'Debit notes',
        link: '/dashboard/debit-note-list',
      },
      {
        title: 'Vendedores',
        link: '/dashboard/vendor-list',
      },
    ]
  },
  {
    title: 'Accounting',
    group: true,
  },
  {
	  title: 'Manual journals',
	  link: '/dashboard/manual-journal-list',
	  icon: 'file-text-outline'
	},
  {
	  title: 'Transactions',
	  link: '/dashboard/transaction-list',
	  icon: 'swap-outline'
	},
  {
	  title: 'Chart of accounts',
	  link: '/dashboard/chart-accounts-list',
	  icon: 'book-outline'
	},
  {
	  title: 'Assets',
	  link: '/dashboard/assets-list',
	  icon: 'briefcase-outline'
	},
  {
    title: 'Reports',
    group: true,
  },
  {
    title: 'Reports',
    link: '/dashboard/reports/profit-and-loss',
    icon: 'bar-chart-outline'
  },
  {
	  title: 'Settings',
	  group: true
	},
]
