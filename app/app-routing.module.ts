import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { BillDownloadComponent } from './bill-download/bill-download.component';
import { BillPreviewComponent } from './bill-preview/bill-preview.component';
import { EstimateDownloadComponent } from './estimate-download/estimate-download.component';
import { EstimateDownload2Component } from './estimate-download2/estimate-download2.component';
import { EstimatePreviewComponent } from './estimate-preview/estimate-preview.component';
import { InvoiceDownloadComponent } from './invoice-download/invoice-download.component';
import { InvoiceDownload2Component } from './invoice-download2/invoice-download2.component';
import { InvoiceViewComponent } from './invoice-view/invoice-view.component';
import { ReceiptViewComponent } from './receipt-view/receipt-view.component';
import { SuccessCheckoutComponent } from './success-checkout/success-checkout.component';
import { PdfInvoiceComponent } from './template/pdf-invoice/pdf-invoice.component';


const routes: Routes = [
  // {path: '', redirectTo:'/', pathMatch:'full'},
  {
    path: 'dashboard',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path:'invoice-view/:id/tenant/:tenantId/token/:token',
    component: InvoiceViewComponent
  },
  {
    path:'bill-view/:id/tenant/:tenantId/token/:token',
    component: BillPreviewComponent
  },
  {
    path:'estimate-view/:id/tenant/:tenantId/token/:token',
    component: EstimatePreviewComponent
  },
  {
    path:'checkout-success',
    component: SuccessCheckoutComponent
  },
  {
    path:'bill/:id/download/tenant/:tenantId/token/:token',
    component: BillDownloadComponent
  },
  {
    path:'bill/:id/download',
    component: BillDownloadComponent
  },
  {
    path:'invoice/:id/receipt/:receiptId/tenant/:tenantId/token/:token',
    component: ReceiptViewComponent
  },
  {
    path:'invoice/:id/download/tenant/:tenantId/token/:token/standard',
    component: InvoiceDownloadComponent
  },
  {
    path:'invoice/:id/download/standard',
    component: InvoiceDownloadComponent
  },
  {
    path:'invoice/:id/download/tenant/:tenantId/token/:token/trappist-1',
    component: InvoiceDownload2Component
  },
  {
    path:'invoice/:id/download/trappist-1',
    component: InvoiceDownload2Component
  },
  {
    path:'estimate/:id/download/tenant/:tenantId/token/:token/standard',
    component: EstimateDownloadComponent
  },
  {
    path:'estimate/:id/download/standard',
    component: EstimateDownloadComponent
  },
  {
    path:'estimate/:id/download/tenant/:tenantId/token/:token/trappist-1',
    component: EstimateDownload2Component
  },
  {
    path:'estimate/:id/download/trappist-1',
    component: EstimateDownload2Component
  },
  {
    path:'account/checkout/completed',
    component: InvoiceViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    relativeLinkResolution: 'legacy',
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
