import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbCardModule, NbIconModule, NbButtonModule, NbSpinnerModule, NbToastrService } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe, DecimalPipe } from '@angular/common';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { InvoiceViewComponent } from './invoice-view/invoice-view.component';
import { InvoiceDowloadDialogComponent } from './admin/invoice/invoice-details/invoice-dowload-dialog/invoice-dowload-dialog.component';
import { httpInterceptorProviders } from './http-interceptor';
import { ReceiptViewComponent } from './receipt-view/receipt-view.component';
import { BillPreviewComponent } from './bill-preview/bill-preview.component';
import { EstimatePreviewComponent } from './estimate-preview/estimate-preview.component';
import { PdfInvoiceComponent } from './template/pdf-invoice/pdf-invoice.component';
import { LayoutService } from './utils';
import { DEFAULT_THEME } from 'src/theme.default';
import { COSMIC_THEME } from 'src/theme.cosmic';
import { CORPORATE_THEME } from 'src/theme.corporate';
import { DARK_THEME } from 'src/theme.dark';
import { EstimateDownloadComponent } from './estimate-download/estimate-download.component';
import { InvoiceDownloadComponent } from './invoice-download/invoice-download.component';
import { BillDownloadComponent } from './bill-download/bill-download.component';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig } from 'angularx-social-login';
import { SuccessCheckoutComponent } from './success-checkout/success-checkout.component';
import { InvoiceDownload2Component } from './invoice-download2/invoice-download2.component';
import { EstimateDownload2Component } from './estimate-download2/estimate-download2.component';
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    InvoiceViewComponent,
    InvoiceDowloadDialogComponent,
    ReceiptViewComponent,
    BillPreviewComponent,
    EstimatePreviewComponent,
    PdfInvoiceComponent,
    EstimateDownloadComponent,
    InvoiceDownloadComponent,
    BillDownloadComponent,
    SuccessCheckoutComponent,
    InvoiceDownload2Component,
      EstimateDownload2Component,
   ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbEvaIconsModule,
    HttpClientModule,
    NgbModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    NbEvaIconsModule,
    NbSpinnerModule,
    TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
    })
  ],
  providers: [
    {provide : LocationStrategy , useClass: HashLocationStrategy},
    DecimalPipe,
    httpInterceptorProviders,
    DatePipe,
    LayoutService,
    ...NbThemeModule.forRoot(
      {
        name: 'default',
      },
      [ DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME, DARK_THEME ],
    ).providers,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              localStorage.getItem('googleId')
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(
              localStorage.getItem('facebookId')
            )
          }
        ]
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

//for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}
