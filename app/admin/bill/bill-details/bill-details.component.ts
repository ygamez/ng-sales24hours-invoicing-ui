import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { Bill } from 'src/app/models/bill';
import { Payment } from 'src/app/models/payment';
import { Status } from 'src/app/models/status';
import { BillService } from 'src/app/service/bill.service';
import { PaymentService } from 'src/app/service/payment.service';
import jspdf from 'jspdf';
import { DebitNote } from 'src/app/models/debitnote';
import { DebitNoteService } from 'src/app/service/debitnote.service';
import { Currency } from 'src/app/models/currency';
import { Company } from 'src/app/models/company';
import { AuthService } from 'src/app/service/auth.service';
import { CompanyService } from 'src/app/service/company.service';
import { CurrencyService } from 'src/app/service/currency.service';
import { TranslateService } from '@ngx-translate/core';
import { PdfBuilderService } from 'src/app/service/pdf-builder.service';

@Component({
	selector: 'bill-details',
	templateUrl: './bill-details.component.html',
	styleUrls: ['./bill-details.component.scss']
})
export class BillDetailsComponent implements OnInit {
	public bill: Bill;
	private id: string = this.route.snapshot.params["id"];
  stepperIndex: number = 0;
  approved: boolean = false;
  Sent: boolean = false;
  paid: boolean = false;
  partiallyPaid: boolean = false;
  labelOne = "Approve";
  labelTwo = "Send";
  labelThree = "Pay";
  payments: Payment[] = [];
  public debitnotes: DebitNote[];
  public currency: Currency;
  public company: Company;
  public resending: boolean;
  defaultCurrency: Currency;
  downloading: boolean = false;
  errorMessage: string;
  billApproveSuccess: string;
  billStatusChangeSuccess: string;
  noAdminRights: string;
  emailIsSent: string;
  deletedItem: string;

	constructor(private currencyService: CurrencyService,
    private pdfBuilder: PdfBuilderService,
    private route: ActivatedRoute,
    private router: Router,
    private billService: BillService,
    private toastrService: NbToastrService,
    private paymentService: PaymentService,
    private debitnoteService: DebitNoteService,
    private _authService: AuthService,
    private translate: TranslateService,
    private companyService: CompanyService) {}

	public ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
    this.translate.get('general.billApproveSuccess').subscribe(res => this.billApproveSuccess = res);
    this.translate.get('general.billStatusChangeSuccess').subscribe(res => this.billStatusChangeSuccess = res);
    this.translate.get('general.noAdminRights').subscribe(res => this.noAdminRights = res);
    this.translate.get('general.emailIsSent').subscribe(res => this.emailIsSent = res);
    this.getBill();
    this.getDefaultCurrency();
	}

	getBill(){
    return this.billService.getSingle(+this.id).subscribe(
      result => {
        this.bill = result;
        this.currency = result.currency;
        this.getPaymentList(result.id);
        this.getDebitNoteList(result.id);
        this.getCompany();
      }, error => {
        console.log(error);
    });
  }

  approve(bill: Bill){
    if(this._authService.getCurrentUser().role.name != "Viewer"){
      bill.status = Status.Approved;
      bill.badgeStatus = Status.BadgeApproved;
      bill.stepperIndex = 1;
      bill.approved = true;
      return this.billService.update(bill).subscribe(
        () => {
          if (this.stepperIndex > -1 && this.stepperIndex < 2){
            this.showToast("success",this.billApproveSuccess);
            this.getBill();
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

  markAsSent(bill: Bill){
    if(this._authService.getCurrentUser().role.name != "Viewer"){
      bill.status = Status.Sent;
      bill.badgeStatus = Status.BadgeSent;
      bill.stepperIndex = 2;
      bill.approved = true;
      bill.sent = true;
      return this.billService.update(bill).subscribe(
        () => {
          if (this.stepperIndex > -1 && this.stepperIndex < 2){
            this.showToast("success",this.billStatusChangeSuccess);
            this.getBill();
          }
        },error =>{
          this.showToast("danger","An error occur. Please try again...")
          console.log(error);
        }
      );
    }
    else{
      this.showToast("warning",this.noAdminRights);
    }
  }

  send(bill:Bill){
    if(this._authService.getCurrentUser().role.name != "Viewer"){
      bill.status = Status.Sent;
      bill.badgeStatus = Status.BadgeSent;
      bill.stepperIndex = 2;
      bill.approved = true;
      bill.sent = true;
      return this.billService.send(bill).subscribe(
        () => {
          if (this.stepperIndex > -1 && this.stepperIndex < 2){
            this.showToast("success",this.emailIsSent);
            this.getBill();
          }
        },error => {
          console.log(error);
          this.showToast("danger", this.errorMessage)
        }
      );
    }
    else{
      this.showToast("warning",this.noAdminRights);
    }

  }

  resend(bill:Bill){
    if(this._authService.getCurrentUser().role.name != "Viewer"){
      this.resending = true;
      return this.billService.resend(bill).subscribe(
        () => {
          this.showToast("success",this.emailIsSent);
          this.getBill();
          this.resending = false;
        },error => {
          console.log(error);
          this.showToast("danger",this.errorMessage);
          this.resending = false;
        }
      );
    }
    else{
      this.showToast("warning",this.noAdminRights);
    }
  }

  pay(id:number){
    if(this._authService.getCurrentUser().role.name != "Viewer"){
      this.router.navigateByUrl("/dashboard/bill/"+id+"/pay");
    }else{
      this.showToast("warning",this.noAdminRights);
    }
  }

  getPaymentList(id: number) {
    return this.paymentService.getAllByBill(id).subscribe( result => {
      this.payments = result;
    }, (error) => {
      console.log(error);
    });
	}

  getDebitNoteList(billId: number) {
		return this.debitnoteService.getAllByBill(billId).subscribe( result => {
		  this.debitnotes = result;
		}, (error) => {
		  console.log(error);
		});
	}

  deleteDebitNote(id){
    return this.debitnoteService.delete(id).subscribe(result => {
		  this.showToast('success',this.deletedItem);
		  this.getBill();
		}, error => {
		  this.showToast('danger',this.errorMessage);
		  console.log(error);
		});
  }

  showToast(status: NbComponentStatus, message: string): void {
		this.toastrService.show(status, message, { status, duration:4000 });
	}

  previewVendorBill(url){
    window.open(url, '_blank');
  }

  getCompany(){
    var tenantId = this._authService.getCurrentUser().tenantId;
    this.companyService.getByTenant(tenantId).subscribe(
      result => {
        this.company = result;
      }, error => {
        console.log(error);
      }
    )
  }

  getDefaultCurrency(){
    return this.currencyService.getDefault().subscribe(
      result => {
        this.defaultCurrency = result;
      },error => {
        console.log(error);
      }
    )
  }

  dwldFromUrl(id: number){
    this.downloading = true;
    return this.billService.download(id).subscribe(
      response => {
        this.billService.downLoadFile(response, "application/pdf");
        this.downloading = false;
      },
      error => console.log(error)
    );
  }

  // downloadPdf(){
  //   window.open(this.bill.downloadUrl, '_blank');
  // }

  downloadPdf(){
    this.pdfBuilder.buildBillPdfStandard(this.bill, this.company, "save");
  }

  printPdf(){
    this.pdfBuilder.buildBillPdfStandard(this.bill, this.company, "print");
  }
}
