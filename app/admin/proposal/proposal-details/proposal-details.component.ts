import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import jspdf from 'jspdf';
import { Company } from 'src/app/models/company';
import { InvoiceCustomization } from 'src/app/models/invoice-customization';
import { Proposal } from 'src/app/models/proposal';
import { Status } from 'src/app/models/status';
import { AuthService } from 'src/app/service/auth.service';
import { CompanyService } from 'src/app/service/company.service';
import { InvoiceService } from 'src/app/service/invoice.service';
import { PdfBuilderService } from 'src/app/service/pdf-builder.service';
import { ProposalService } from 'src/app/service/proposal.service';

@Component({
	selector: 'proposal-details',
	templateUrl: './proposal-details.component.html',
	styleUrls: ['./proposal-details.component.scss']
})
export class ProposalDetailsComponent implements OnInit {
  public proposal: Proposal;
	private id: string = this.route.snapshot.params["id"];
  stepperIndex: number = 0;
  approved: boolean = false;
  Sent: boolean = false;
  paid: boolean = false;
  partiallyPaid: boolean = false;
  labelOne = "Approve";
  labelTwo = "Send";
  loading: boolean = false;
  sending: boolean = false;
  company: Company;
  downloading: boolean = false;
  invoiceName: string = "standard";
  errorMessage: string;
  proposalApproveSuccess: string;
  proposalStatusChangeSuccess: string;
  noAdminRights: string;
  emailIsSent: string;
  deletedItem: string;
  invoiceCustomization: InvoiceCustomization;

	constructor(private route: ActivatedRoute,
    private pdfBuilder: PdfBuilderService,
    private translate: TranslateService,
    private router: Router,
    private proposalService: ProposalService,
    private invoiceService: InvoiceService,
    private toastrService: NbToastrService,
    private _authService: AuthService,
    private companyService: CompanyService) {}

	public ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
    this.translate.get('general.proposalApproveSuccess').subscribe(res => this.proposalApproveSuccess = res);
    this.translate.get('general.proposalStatusChangeSuccess').subscribe(res => this.proposalStatusChangeSuccess = res);
    this.translate.get('general.noAdminRights').subscribe(res => this.noAdminRights = res);
    this.translate.get('general.emailIsSent').subscribe(res => this.emailIsSent = res);
    this.getInvoiceCustomizationInfos();
    this.getProposal();
    this.getCompany();
	}

	getProposal(){
    this.loading = true;
    return this.proposalService.getSingle(+this.id).subscribe(
      result => {
        this.loading = false;
        this.proposal = result;
      }, error => {
        console.log(error);
    });
  }

  approve(proposal: Proposal){
    if(this._authService.getCurrentUser().role.name != "Viewer"){
      proposal.status = Status.Approved;
      proposal.badgeStatus = Status.BadgeApproved;
      proposal.stepperIndex = 1;
      proposal.approved = true;
      return this.proposalService.update(proposal).subscribe(
        () => {
          if (this.stepperIndex > -1 && this.stepperIndex < 2){
            this.showToast("success", this.proposalApproveSuccess);
            this.getProposal();
          }
        },error =>{
          this.showToast("danger",this.errorMessage)
          console.log(error);
        }
      );
    }else{
      this.showToast("warning", this.noAdminRights)
    }
  }

  markAsSent(proposal: Proposal){
    if(this._authService.getCurrentUser().role.name != "Viewer"){
      proposal.status = Status.Sent;
      proposal.badgeStatus = Status.BadgeSent;
      proposal.stepperIndex = 2;
      proposal.approved = true;
      proposal.sent = true;
      return this.proposalService.update(proposal).subscribe(
        () => {
          if (this.stepperIndex > -1 && this.stepperIndex < 2){
            this.showToast("success",this.proposalStatusChangeSuccess);
            this.getProposal();
          }
        },error =>{
          this.showToast("danger","An error occur. Please try again...")
          console.log(error);
        }
      );
    }else{
      this.showToast("warning", this.noAdminRights)
    }
  }

  send(proposal:Proposal){
    if(this._authService.getCurrentUser().role.name != "Viewer"){
      proposal.status = Status.Sent;
      proposal.badgeStatus = Status.BadgeSent;
      proposal.stepperIndex = 2;
      proposal.approved = true;
      proposal.sent = true;
      return this.proposalService.send(proposal).subscribe(
        () => {
          if (this.stepperIndex > -1 && this.stepperIndex < 2){
            this.showToast("success", this.emailIsSent);
            this.getProposal();
          }
        },error => {
          console.log(error);
          this.showToast("danger", this.errorMessage)
        }
      );
    }
    else{
      this.showToast("warning",this.noAdminRights)
    }
  }

  resend(proposal:Proposal){
    if(this._authService.getCurrentUser().role.name != "Viewer"){
      this.sending = true;
      return this.proposalService.resend(proposal).subscribe(
        () => {
          this.sending = false;
          this.showToast("success",this.emailIsSent);
          this.getProposal();
        },error => {
          this.sending = false;
          console.log(error);
          this.showToast("danger",this.errorMessage)
        }
      );
    }
    else{
      this.showToast("warning",this.noAdminRights)
    }
  }

  declined(proposal: Proposal){
    if(this._authService.getCurrentUser().role.name != "Viewer"){
      proposal.status = Status.Declined;
      proposal.badgeStatus = Status.BadgeDeclined;
      proposal.stepperIndex = 3;
      proposal.declined = true;
      proposal.accepted = false;
      return this.proposalService.update(proposal).subscribe(
        () => {
          this.showToast("success", this.proposalStatusChangeSuccess);
          this.getProposal();
        },error =>{
          this.showToast("danger", this.errorMessage)
          console.log(error);
        }
      );
    }
    else{
      this.showToast("warning",this.noAdminRights)
    }
  }

  accepted(proposal: Proposal){
    if(this._authService.getCurrentUser().role.name != "Viewer"){
      proposal.status = Status.Accepted;
      proposal.badgeStatus = Status.BadgePaid;
      proposal.stepperIndex = 3;
      proposal.accepted = true;
      proposal.declined = false;
      return this.proposalService.update(proposal).subscribe(
        () => {
          this.showToast("success", this.proposalStatusChangeSuccess);
          this.getProposal();
        },error =>{
          this.showToast("danger", this.proposalApproveSuccess)
          console.log(error);
        }
      );
    }
    else{
      this.showToast("warning",this.noAdminRights)
    }
  }

  pay(id:number){
    if(this._authService.getCurrentUser().role.name != "Viewer"){
      this.router.navigateByUrl("/dashboard/proposal/"+id+"/pay");
    }
    else{
      this.showToast("warning",this.noAdminRights)
    }
  }

  showToast(status: NbComponentStatus, message: string): void {
		this.toastrService.show(status, message, { status, duration:4000 });
	}

  previewCustomerInvoice(url){
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

  getInvoiceCustomizationInfos(){
    var tenantId = this._authService.getCurrentUser().tenantId;
    return this.invoiceService.getCustomizationInfos(tenantId).subscribe(
      result => {
        if (result != null) this.invoiceName = result.invoiceName;
        this.invoiceCustomization = result;
      }, error => {
        console.log(error);
      }
    );
  }

  dwldFromUrl(id: number){
    this.downloading = true;
    return this.proposalService.download(id, this.invoiceName.toLowerCase()).subscribe(
      response => {
        this.proposalService.downLoadFile(response, "application/pdf");
        this.downloading = false;
      },
      error => console.log(error)
    );
  }

  // downloadPdf(){
  //   window.open(this.proposal.downloadUrl+"/"+this.invoiceName, '_blank');
  // }

  downloadPdf(){
    if (this.invoiceName === "standard"){
      this.pdfBuilder.buildEstimatePdfStandard(this.proposal, this.invoiceCustomization, this.company, "save");
    }else if (this.invoiceName === "trappist-1"){
      this.pdfBuilder.buildEstimatePdfTrappist1(this.proposal, this.invoiceCustomization, this.company, "save");
    }
  }

  print(){
    if (this.invoiceName === "standard"){
      this.pdfBuilder.buildEstimatePdfStandard(this.proposal, this.invoiceCustomization, this.company, "print");
    }else if (this.invoiceName === "trappist-1"){
      this.pdfBuilder.buildEstimatePdfTrappist1(this.proposal, this.invoiceCustomization, this.company, "print");
    }
  }

}
