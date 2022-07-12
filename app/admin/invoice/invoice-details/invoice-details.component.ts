import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NbComponentStatus, NbDialogService, NbMenuItem, NbToastrService } from '@nebular/theme';
import { Invoice } from 'src/app/models/invoice';
import { Revenue } from 'src/app/models/revenue';
import { Status } from 'src/app/models/status';
import { InvoiceService } from 'src/app/service/invoice.service';
import { RevenueService } from 'src/app/service/revenue.service';
import { CreditNote } from 'src/app/models/creditnote';
import { CreditNoteService } from 'src/app/service/creditnote.service';
import { InvoiceDowloadDialogComponent } from './invoice-dowload-dialog/invoice-dowload-dialog.component';
import { DateService } from 'src/app/service/date.service';
import { ReceiptSendingDialogComponent } from './receipt-sending-dialog/receipt-sending-dialog.component';
import { Company } from 'src/app/models/company';
import { AuthService } from 'src/app/service/auth.service';
import { CompanyService } from 'src/app/service/company.service';
import { CurrencyService } from 'src/app/service/currency.service';
import { Currency } from 'src/app/models/currency';
import { TranslateService } from '@ngx-translate/core';
import { InvoiceCustomization } from 'src/app/models/invoice-customization';
import { PdfBuilderService } from 'src/app/service/pdf-builder.service';

@Component({
	selector: 'invoice-details',
	templateUrl: './invoice-details.component.html',
	styleUrls: ['./invoice-details.component.scss']
})
export class InvoiceDetailsComponent implements OnInit {
  invoice: Invoice;
	private id: string = this.route.snapshot.params["id"];
  stepperIndex: number = 0;
  approved: boolean = false;
  Sent: boolean = false;
  paid: boolean = false;
  partiallyPaid: boolean = false;
  labelOne = "Approve";
  labelTwo = "Send";
  labelThree = "Pay";
  revenues: Revenue[] = [];
  creditnotes: CreditNote[];
  payementCompleted: boolean = false;
  receiptItemMenu:NbMenuItem[] = [];
  progress:number;
  sendingInvoice: boolean = false;
  sendingReceipt: boolean = false;
  company: Company;
  sendingReminder: boolean = false;
  currency: Currency;
  downloading: boolean = false;
  invoiceName: string = "standard";
  errorMessage: string;
  invoiceApproveSuccess: string;
  invoiceStatusChangeSuccess: string;
  noAdminRights: string;
  emailIsSent: string;
  deletedItem: string;
  invoiceCustomization: InvoiceCustomization;
  daily: string;
  weekly: string;
  monthly: string;
  yearly: string;
  custom: string;
  day: string;
  weekRepeat: string;
  monthRepeat: string;
  yearRepeat: string;

	constructor(private _authService: AuthService,
    private translate: TranslateService,
    private companyService : CompanyService,
    private route: ActivatedRoute,
    private _dialogService: NbDialogService,
    private router: Router,
    private invoiceService: InvoiceService,
    private toastrService: NbToastrService,
    private revenueService: RevenueService,
    private dateService: DateService,
    private currencyService: CurrencyService,
    private pdfBuilder: PdfBuilderService,
    private creditnoteService: CreditNoteService) {}

	public ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
    this.translate.get('general.invoiceApproveSuccess').subscribe(res => this.invoiceApproveSuccess = res);
    this.translate.get('general.invoiceStatusChangeSuccess').subscribe(res => this.invoiceStatusChangeSuccess = res);
    this.translate.get('general.noAdminRights').subscribe(res => this.noAdminRights = res);
    this.translate.get('general.emailIsSent').subscribe(res => this.emailIsSent = res);
    this.translate.get('general.daily').subscribe(res => this.daily = res);
    this.translate.get('general.weekly').subscribe(res => this.weekly = res);
    this.translate.get('general.monthly').subscribe(res => this.monthly = res);
    this.translate.get('general.yearly').subscribe(res => this.yearly = res);
    this.translate.get('general.custom').subscribe(res => this.custom = res);
    this.translate.get('general.day').subscribe(res => this.day = res);
    this.translate.get('general.weekRepeat').subscribe(res => this.weekRepeat = res);
    this.translate.get('general.monthRepeat').subscribe(res => this.monthRepeat = res);
    this.translate.get('general.yearReapeat').subscribe(res => this.yearRepeat = res);
    this.getInvoice();
    this.getDefaultCurrency();
    this.getInvoiceCustomizationInfos();
	}

	getInvoice(){
    this.receiptItemMenu = [];
    return this.invoiceService.getSingle(+this.id).subscribe(
      result => {
        console.log(result);
        switch(result.repeatFrequency)
        {
          case 'daily':
            result.repeatFrequency = this.daily;
            break;
          case 'weekly':
            result.repeatFrequency = this.weekly;
            break;
          case 'monthly':
            result.repeatFrequency = this.monthly;
            break;
          case 'yearly':
            result.repeatFrequency = this.yearly;
            break;
          case 'custom':
            result.repeatFrequency = this.custom;
            break;
        }
        switch(result.customFrequency)
        {
          case 'day':
            result.customFrequency = this.day;
            break;
          case 'week':
            result.customFrequency = this.weekRepeat;
            break;
          case 'month':
            result.customFrequency = this.monthRepeat;
            break;
          case 'year':
            result.customFrequency = this.yearRepeat;
            break;
        }
        this.invoice = result;
        this.getCompany();
        this.getRevenueList(result.id);
        this.getCreditNoteList(result.id);
      }, error => {
        console.log(error);
    });
  }

  approve(invoice: Invoice){
    if(this._authService.getCurrentUser().role.name != "Viewer"){
      invoice.status = Status.Approved;
      invoice.badgeStatus = Status.BadgeApproved;
      invoice.stepperIndex = 1;
      invoice.approved = true;
      return this.invoiceService.update(invoice).subscribe(
          () => {
          this.showToast("success", this.invoiceApproveSuccess);
            this.getInvoice();
        },error =>{
          this.showToast("danger",this.errorMessage)
          console.log(error);
        }
      );
    }
    else{
      this.showToast("warning", this.noAdminRights);
    }
  }

  markAsSent(invoice: Invoice){
    if(this._authService.getCurrentUser().role.name != "Viewer"){
      invoice.status = Status.Sent;
      invoice.badgeStatus = Status.BadgeSent;
      invoice.stepperIndex = 2;
      invoice.approved = true;
      invoice.sent = true;
      return this.invoiceService.update(invoice).subscribe(
        () => {
          if (this.stepperIndex > -1 && this.stepperIndex < 2){
            this.showToast("success",this.invoiceStatusChangeSuccess);
            this.getInvoice();
          }
        },error =>{
          this.showToast("danger",this.errorMessage)
          console.log(error);
        }
      );
    }
    else{
      this.showToast("warning",this.noAdminRights);
    }
  }

  send(invoice:Invoice){
    if(this._authService.getCurrentUser().role.name != "Viewer"){
      invoice.status = Status.Sent;
      invoice.badgeStatus = Status.BadgeSent;
      invoice.stepperIndex = 2;
      invoice.approved = true;
      invoice.sent = true;
      return this.invoiceService.send(invoice).subscribe(
        () => {
          if (this.stepperIndex > -1 && this.stepperIndex < 2){
            this.showToast("success", this.emailIsSent);
            this.getInvoice();
          }
        },error => {
          console.log(error);
          this.showToast("danger",this.errorMessage)
        }
      );
    }
    else{
      this.showToast("warning",this.noAdminRights);
    }
  }

  resend(invoice:Invoice){
    if(this._authService.getCurrentUser().role.name != "Viewer"){
      this.sendingInvoice = true;
      return this.invoiceService.resend(invoice).subscribe(
        () => {
          this.showToast("success",this.emailIsSent);
          this.getInvoice();
          this.sendingInvoice = false;
        },error => {
          console.log(error);
          this.showToast("danger",this.errorMessage);
          this.sendingInvoice = false;
        }
      );
    }
    else{
      this.showToast("warning",this.noAdminRights);
    }

  }

  sendReminder(invoice:Invoice){
    if(this._authService.getCurrentUser().role.name != "Viewer"){
      this.sendingReminder = true;
      return this.invoiceService.sendReminder(invoice).subscribe(
        () => {
          this.showToast("success",this.emailIsSent);
          this.getInvoice();
          this.sendingReminder = false;
        },error => {
          console.log(error);
          this.showToast("danger",this.errorMessage);
          this.sendingReminder = false;
        }
      );
    }
    else{
      this.showToast("warning",this.noAdminRights);
    }
  }

  sendReceipt(invoice:Invoice, receiptId){
    if(this._authService.getCurrentUser().role.name != "Viewer"){
      return this.invoiceService.sendReceipt(invoice, receiptId).subscribe(
        () => {
          this.showToast("success",this.emailIsSent);
          this.getInvoice();
        },error => {
          console.log(error);
          this.showToast("danger","An error occur. Please try again..")
        }
      );
    }
    else{
      this.showToast("warning",this.noAdminRights)
    }

  }

  pay(id:number){
    if(this._authService.getCurrentUser().role.name != "Viewer"){
      this.router.navigateByUrl("/dashboard/invoice/"+id+"/pay");
    }
    else{
      this.showToast("warning",this.noAdminRights)
    }
  }

  provideFile(data, filename: string){
    const blob = new Blob([data], { type: 'application/pdf' });
    const url= window.URL.createObjectURL(blob);
    window.open(url)
    let a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  getRevenueList(id: number) {
    return this.revenueService.getAllByInvoice(id).subscribe( result => {
      this.revenues = result;
      console.log(result);
    }, (error) => {
      console.log(error);
    });
	}

  getCreditNoteList(invoiceId: number) {
		return this.creditnoteService.getAllByInvoice(invoiceId).subscribe( result => {
		  this.creditnotes = result;
		}, (error) => {
		  console.log(error);
		});
	}

  deleteCreditNote(id){
    if(this._authService.getCurrentUser().role.name != "Viewer"){
      return this.creditnoteService.delete(id).subscribe(result => {
        this.showToast('success',this.deletedItem);
        this.getInvoice();
      }, error => {
        this.showToast('danger',this.errorMessage);
        console.log(error);
      });
    }
    else{
      this.showToast("warning",this.noAdminRights)
    }
  }

  showToast(status: NbComponentStatus, message: string): void {
		this.toastrService.show(status, message, { status, duration:4000 });
	}

  downloadInvoice(reference: string) {
    this._dialogService.open(InvoiceDowloadDialogComponent, { closeOnBackdropClick: false })
      .onClose.subscribe(() => {

      });
  }

  previewCustomerInvoice(url){
    window.open(url, '_blank');
  }


  receiptDialog() {
    this.invoiceService.setInvoice(this.invoice);
    this._dialogService.open(ReceiptSendingDialogComponent, { closeOnBackdropClick: false })
      .onClose.subscribe(result => {
        if(result != null){
          this.sendReceipt(this.invoice, result.id);
        }
    });
  }

  getInvoiceCustomizationInfos(){
    var tenantId = this._authService.getCurrentUser().tenantId;
    return this.invoiceService.getCustomizationInfos(tenantId).subscribe(
      result => {
        this.invoiceCustomization = result;
        if (result != null) this.invoiceName = result.invoiceName;
      }, error => {
        console.log(error);
      }
    );
  }

  dwldFromUrl(id: number){
    this.downloading = true;
    return this.invoiceService.download(id, this.invoiceName.toLowerCase()).subscribe(
      response => {
        this.invoiceService.downLoadFile(response, "application/pdf");
        this.downloading = false;
      },
      error => {
        this.downloading = false;
        console.log(error);
      }
    );
  }

  getCompany(){
    var tenantId = this._authService.getCurrentUser().tenantId;
    this.companyService.getByTenant(tenantId).subscribe(
      result => {
        this.company = result;
      }, error => {
        console.log(error);
      }
    );
  }

  getDefaultCurrency(){
    return this.currencyService.getDefault().subscribe(
      result => {
        this.currency = result;
      },error => {
        console.log(error);
      }
    );
  }

  downloadPdf(){
    if (this.invoiceName === "standard"){
      this.pdfBuilder.buildInvoicePdfStandard(this.invoice, this.invoiceCustomization, this.company, "save");
    }else if (this.invoiceName === "trappist-1"){
      this.pdfBuilder.buildInvoicePdfTrappist1(this.invoice, this.invoiceCustomization, this.company, "save");
    }
  }

  printPdf(){
    if (this.invoiceName === "standard"){
      this.pdfBuilder.buildInvoicePdfStandard(this.invoice, this.invoiceCustomization, this.company, "print");
    }else if (this.invoiceName === "trappist-1"){
      this.pdfBuilder.buildInvoicePdfTrappist1(this.invoice, this.invoiceCustomization, this.company, "print");
    }
  }

}
