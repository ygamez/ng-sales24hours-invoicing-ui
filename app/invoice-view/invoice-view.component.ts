import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Invoice } from 'src/app/models/invoice';
import { InvoiceService } from 'src/app/service/invoice.service';
import jsPDF from 'jspdf';
import * as html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import { MyStripeService } from '../service/my-stripe.service';
import { loadStripe } from '@stripe/stripe-js/pure';
import { environment } from 'src/environments/environment';
import { StripeSession } from '../models/stripe-session';
import { AuthService } from '../service/auth.service';
import { BankAccountService } from '../service/bankaccount.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StripeAccount } from '../models/stripe-account';
import { Company } from '../models/company';
import { PaypalPartnerReferal } from '../models/paypal-partner-referal';
import { SettingService } from '../service/setting.service';
import { SettingType } from '../models/setting-type';
import { InvoiceCustomization } from '../models/invoice-customization';
import { PdfBuilderService } from '../service/pdf-builder.service';
declare var paypal;
import PDFObject from 'pdfobject';


@Component({
  selector: 'app-invoice-view',
  templateUrl: './invoice-view.component.html',
  styleUrls: ['./invoice-view.component.scss']
})
export class InvoiceViewComponent implements OnInit, AfterViewChecked {
  public invoice: Invoice;
  private id: string = this.route.snapshot.params["id"];
  private action: string = this.route.snapshot.params["action"];
  private ready: boolean = false;
  private downloaded: boolean = false;
  token: string = this.route.snapshot.params["token"];
  tenantId: string = this.route.snapshot.params["tenantId"];
  private helper: JwtHelperService;
  private customerEmail: string;
  private stripeApiUrl = environment.apiHost + '/stripe';
  private paypalApiUrl = environment.apiHost + '/paypal';
  private invoiceApiUrl = environment.apiHost + '/invoice';
  private settingApiUrl = environment.apiHost + '/setting';
  public checkoutLoading = false;
  public company: Company;
  @ViewChild('paypal') paypalElement;
  private paypalBtnRendered: boolean = false;
  loading: boolean = false;
  hasStripeConnected : boolean = false;
  invoiceName: string = "standard";
  downloading: boolean = false;
  printing: boolean = false;
  stripePublishableKey: string;
  invoiceCustomization: InvoiceCustomization;
  pdfUri: any;

  constructor(private settingService: SettingService,
    private http: HttpClient,
    private authService: AuthService,
    private pdfBuilder: PdfBuilderService,
    private router: Router,
    private route: ActivatedRoute) {
    this.helper = new JwtHelperService();
    if (this.token == null) {
      this.router.navigateByUrl('auth/401-unauthorized');
    } else if (this.helper.isTokenExpired(this.token)) {
      this.router.navigateByUrl('auth/401-unauthorized');
    }
    localStorage.setItem("customerToken", this.token);
    this.getPayPalPartner();
  }

  ngAfterViewChecked(): void {
    if (!this.paypalBtnRendered) {
      this.paypalCheckout();
    }
  }

  public ngOnInit(): void {
    this.getPaymentSetting();
    this.checkStripeAccount();
    this.getInvoice();
    this.getCompany();
  }

  getInvoice() {
    const headers = new HttpHeaders({ "Authorization": "Bearer " + this.token });
    return this.http.get<Invoice>(this.invoiceApiUrl + '/' + this.id, { headers: headers }).subscribe(
      result => {
        this.invoice = result;
        this.customerEmail = this.invoice.customer.email;
        if (this.helper.decodeToken(this.token).customerEmail !== this.customerEmail) {
          this.router.navigateByUrl('auth/401-unauthorized');
        }
        this.getInvoiceCustomizationInfos();

      }, error => {
        console.log(error);
      });
  }

  getPayPalPartner() {
    const headers = new HttpHeaders({ "Authorization": "Bearer " + this.token });
    return this.http.get<PaypalPartnerReferal>(this.paypalApiUrl + '/account/tenant/' + this.tenantId, { headers: headers }).subscribe(
      result => {
        if(result){
          this.settingService.getByType(SettingType.PAYMENT).subscribe(
            setting => {
              if (setting != null){
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = "https://www.paypal.com/sdk/js?&client-id="+setting.paypalPlatformPartnerClientId+"&merchant-id=" + result.merchantIdInPayPal;
                $("head").append(script);
              }
            }, error => {
              console.log(error);
            }
          );
        }
      }, error => {
        console.log(error);
      });
  }

  async stripeCheckout() {
    if (this.stripePublishableKey){
      this.checkoutLoading = true;
      const stripe = await loadStripe(this.stripePublishableKey);
      const headers = new HttpHeaders({ "Authorization": "Bearer " + this.token });
      return this.http.get<StripeAccount>(this.stripeApiUrl + '/tenant/' + this.tenantId + '/account', { headers: headers }).subscribe(
        account => {
          if (account != null && this.invoice != null) {
            const stripeSession = new StripeSession();
            stripeSession.currency = this.invoice.currency.isoCode;
            console.log(this.invoice.currency);
            stripeSession.productName = "Invoice payment - " + window.location.origin + " - Ref: " + this.invoice.reference;
            stripeSession.quantity = 1;
            stripeSession.connectedAccount = account;
            stripeSession.successUrl = window.location.origin+"/#/checkout-success";
            stripeSession.cancelUrl = window.location.origin;
            stripeSession.amount = this.invoice.totalAmount;
            stripeSession.applicationFeeAmount = (this.invoice.totalAmount * 2.9) / 100;
            stripeSession.customerId = this.invoice.customerId;
            stripeSession.invoiceId = this.invoice.id;
            stripeSession.planId = 1;
            stripeSession.createdById = this.authService.getCurrentUser().id;
            this.http.post<StripeSession>(this.stripeApiUrl + '/checkout/session', stripeSession, { headers: headers }).subscribe(
              (result) => {
                if (result != null) {
                  stripe.redirectToCheckout({
                    // Make the id field from the Checkout Session creation API response
                    // available to this file, so you can provide it as argument here
                    // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
                    sessionId: result.sessionId
                  }).then(function (result) {
                    // If `redirectToCheckout` fails due to a browser or network
                    // error, display the localized error message to your customer
                    // using `result.error.message`.
                  });
                }

              },
              error => {
                console.log(error);
              }
            );
          }
        }, error => {
          console.log(error);
          this.checkoutLoading = false;
        });
    }

  }

  checkStripeAccount() {
    const headers = new HttpHeaders({ "Authorization": "Bearer " + this.token });
    return this.http.get<StripeAccount>(this.stripeApiUrl + '/tenant/' + this.tenantId + '/account', { headers: headers }).subscribe(
      result => {
        this.hasStripeConnected = result != null;
      }, error => {
        console.log(error);
      });
  }

  // downloadPdf(name) {
  //   var element = document.getElementById('pdfContent');
  //   // This will implicitly create the canvas and PDF objects before saving.
  //   var opt = {
  //     // margin:       1,
  //     filename: name + '.pdf',
  //     image: { type: 'jpeg', quality: 1 },
  //     html2canvas: { scale: 2 },
  //     jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  //   };
  //   html2pdf().set(opt).from(element).save();
  //   this.downloaded = true;
  // }

  printPdf(){
    var data = document.getElementById('pdfContent');
    html2canvas(data).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png');
      var x = document.createElement("IMG");
      x.setAttribute("src", contentDataURL);
      x.setAttribute("alt", "Printable");
      const WindowPrt = window.open();
      // WindowPrt.document.write('<iframe src="' + contentDataURL  + '" frameborder="0" style="border:0; top:0px; left:0px;right:0px; width:auto; height:1000px;" allowfullscreen></iframe>');
      WindowPrt.document.body.appendChild(x);
      WindowPrt.document.close();
      WindowPrt.focus();
      setTimeout(() => {
        WindowPrt.print();
        WindowPrt.close();
      }, 1000);
    });
  }

  getCompany() {
    const headers = new HttpHeaders({ "Authorization": "Bearer " + this.token });
    return this.http.get<Company>(environment.apiHost + '/company/tenant/' + this.tenantId, { headers: headers }).subscribe(
      result => {
        this.company = result;
      }, error => {
        console.log(error);
      });
  }

  paypalCheckout() {
    if (this.paypalElement) {
      paypal.Buttons({
        style: {
          // layout:'vertical',
          layout: 'horizontal',
          size: 'small'
        },
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                description: this.invoice.description,
                amount: {
                  currency_code: this.invoice.currency.isoCode,
                  value: this.invoice.totalAmount
                }
              }
            ]
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          console.log(order);
          let status: string = "patially-paid"
          if (order.amount == this.invoice.totalAmount) status = "paid";
          this.paypalCheckoutCompleted(status);
        },
        onError: err => {
          console.log(err);
        }
      })
        .render(this.paypalElement.nativeElement);
      this.paypalBtnRendered = true;
    }
  }

  paypalCheckoutCompleted(status: string) {
    this.loading = true;
    if (this.invoice != null) {
      const headers = new HttpHeaders({ "Authorization": "Bearer " + this.token });
      return this.http.post<Invoice>(this.paypalApiUrl + '/invoice/'+this.invoice.id+'/checkout/completed/order/'+status, {}, { headers: headers }).subscribe(
        result => {
          this.invoice = result;
          this.customerEmail = this.invoice.customer.email;
          if (result != null){
            location.href = result.customerReceiptLink;
          }
          if (this.helper.decodeToken(this.token).customerEmail !== this.customerEmail) {
            this.router.navigateByUrl('auth/401-unauthorized');
          }
          this.loading = false;
        }, error => {
          console.log(error);
          this.loading = false;
        }
      );
    }
  }

  getInvoiceCustomizationInfos(){
    const headers = new HttpHeaders({ "Authorization": "Bearer " + this.token });
    return  this.http.get<InvoiceCustomization>(this.invoiceApiUrl + '/customization/tenant/'+this.tenantId, { headers: headers }).subscribe(
      result => {
        this.invoiceCustomization = result;
        if (result != null) this.invoiceName = result.invoiceName;
        this.embedPdf();
      }, error => {
        console.log(error);
      }
    );
  }

  dwldFromUrl(id: number){
    this.downloading = true;
    const headers = new HttpHeaders({ "Authorization": "Bearer " + this.token });
    return this.http.get(this.invoiceApiUrl + '/download/'+id+'/name/'+this.invoiceName,  {
      headers: headers,
      reportProgress: true,
      responseType: 'blob',
    }).subscribe(
      response => {this.downLoadFile(response, "application/pdf");
      this.downloading = false;
      },
      error => {
        console.log(error);
        this.downloading = false;
      }
    );
  }

  printFromUrl(id: number){
    this.printing = true;
    const headers = new HttpHeaders({ "Authorization": "Bearer " + this.token });
    return this.http.get(this.invoiceApiUrl + '/download/'+id+'/name/'+this.invoiceName,  {
      headers: headers,
      reportProgress: true,
      responseType: 'blob',
    }).subscribe(
      response => {this.downLoadFile(response, "application/pdf");
      this.printing = false;
    },
      error => {
        this.printing = false;
        console.log(error);
      }
    );
  }

  downLoadFile(data: any, type: string) {
      let blob = new Blob([data], { type: type});
      let url = window.URL.createObjectURL(blob);
      let pwa = window.open(url);
      if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
          alert( 'Please disable your Pop-up blocker and try again.');
      }
  }

  getPaymentSetting(){
    return this.settingService.getByType(SettingType.PAYMENT).subscribe(
      result => {
        if (result != null){
          this.stripePublishableKey = result.stripePublishableKey;
        }
      }, error => {
        console.log(error);
      }
    );
	}

  // downloadPdf(){
  //   window.open(this.invoice.downloadUrl+"/"+this.invoiceName, '_blank');
  // }

  downloadPdf(){
    if (this.invoiceName === "standard"){
      this.pdfBuilder.buildInvoicePdfStandard(this.invoice, this.invoiceCustomization, this.company, "save");
    }else if (this.invoiceName === "trappist-1"){
      this.pdfBuilder.buildInvoicePdfTrappist1(this.invoice, this.invoiceCustomization, this.company, "save");
    }
  }

  print(){
    if (this.invoiceName === "standard"){
      this.pdfBuilder.buildInvoicePdfStandard(this.invoice, this.invoiceCustomization, this.company, "print");
    }else if (this.invoiceName === "trappist-1"){
      this.pdfBuilder.buildInvoicePdfTrappist1(this.invoice, this.invoiceCustomization, this.company, "print");
    }
  }

  embedPdf(){
    if (this.invoiceName === "standard"){
      PDFObject.embed(this.pdfBuilder.buildInvoicePdfStandard(this.invoice, this.invoiceCustomization, this.company, "embed"), "#pdfSpace");

    }else if (this.invoiceName === "trappist-1"){
      PDFObject.embed(this.pdfBuilder.buildInvoicePdfTrappist1(this.invoice, this.invoiceCustomization, this.company, "embed"), "#pdfSpace");
    }
  }

}
