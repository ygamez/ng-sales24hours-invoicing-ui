import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import { environment } from 'src/environments/environment';
import { AuthService } from '../service/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Proposal } from '../models/proposal';
import * as html2pdf from 'html2pdf.js';
import { Company } from '../models/company';
import { CompanyService } from '../service/company.service';
import { InvoiceCustomization } from '../models/invoice-customization';
import { PdfBuilderService } from '../service/pdf-builder.service';
import PDFObject from 'pdfobject';

@Component({
  selector: 'app-estimate-preview',
  templateUrl: './estimate-preview.component.html',
  styleUrls: ['./estimate-preview.component.scss']
})
export class EstimatePreviewComponent implements OnInit {

  public proposal: Proposal;
  private id: string = this.route.snapshot.params["id"];
  private action: string = this.route.snapshot.params["action"];
  private ready: boolean = false;
  private downloaded: boolean = false;
  token: string = this.route.snapshot.params["token"];
  tenantId: string = this.route.snapshot.params["tenantId"];
  private helper: JwtHelperService;
  private customerEmail: string;
	private stripeApiUrl = environment.apiHost + '/stripe';
	private proposalApiUrl = environment.apiHost + '/proposal';
  private invoiceApiUrl = environment.apiHost + '/invoice';
  @ViewChild('pdf') pdf: ElementRef;
  company: Company;
  downloading = false;
  printing = false;
  invoiceName: string = "standard";
  invoiceCustomization: InvoiceCustomization;

  constructor(private pdfBuilder: PdfBuilderService,
    private companyService: CompanyService,
    private http: HttpClient,
    private _authService: AuthService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) {
      this.helper = new JwtHelperService();
      if (this.token && this.helper.isTokenExpired(this.token)){
        this.router.navigateByUrl('auth/401-unauthorized');
      }
      localStorage.setItem("customerToken", this.token);
    }

  ngAfterViewChecked(): void {
  }

	public ngOnInit(): void {
    this.getProposal();
    this.getCompany();
	}

	getProposal(){
    const headers = new HttpHeaders({"Authorization": "Bearer " + this.token});
    return this.http.get<Proposal>(this.proposalApiUrl + '/' + this.id, { headers: headers }).subscribe(
      result => {
        this.proposal = result;
        this.customerEmail = this.proposal.customer.email;
        if (this.token && this.helper.decodeToken(this.token).customerEmail !== this.customerEmail ){
          this.router.navigateByUrl('auth/401-unauthorized');
        }
        this.getInvoiceCustomizationInfos(result);
      }, error => {
        console.log(error);
    });
  }


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

  // downloadPdf(name){
  //   var element = document.getElementById('pdfContent');
  //   // This will implicitly create the canvas and PDF objects before saving.
  //     var opt = {
  //       // margin:       1,
  //       filename:     name+'.pdf',
  //       image:        { type: 'jpeg', quality: 1 },
  //       html2canvas:  { scale: 2 },
  //       jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  //     };
  //     html2pdf().set(opt).from(element).save();
  // }

  getCompany() {
    const headers = new HttpHeaders({ "Authorization": "Bearer " + this.token });
    return this.http.get<Company>(environment.apiHost + '/company/tenant/' + this.tenantId, { headers: headers }).subscribe(
      result => {
        this.company = result;
      }, error => {
        console.log(error);
      });
  }

  getInvoiceCustomizationInfos(estimate: Proposal){
    const headers = new HttpHeaders({ "Authorization": "Bearer " + this.token });
    return  this.http.get<InvoiceCustomization>(this.invoiceApiUrl + '/customization/tenant/'+this.tenantId, { headers: headers }).subscribe(
      result => {
        if (result != null) this.invoiceName = result.invoiceName;
        this.invoiceCustomization = result;
        this.embedPdf(estimate);
      }, error => {
        console.log(error);
      }
    );
  }

  dwldFromUrl(id: number){
    this.downloading = true;
    const headers = new HttpHeaders({ "Authorization": "Bearer " + this.token });
    return this.http.get(this.proposalApiUrl + '/download/'+id+'/name/'+this.invoiceName,  {
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
    return this.http.get(this.proposalApiUrl + '/download/'+id+'/name/'+this.invoiceName,  {
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

  embedPdf(proposal: Proposal){
    if (this.invoiceName === "standard"){
      PDFObject.embed(this.pdfBuilder.buildEstimatePdfStandard(proposal, this.invoiceCustomization, this.company, "embed"), "#pdfSpace");
    }else if (this.invoiceName === "trappist-1"){
      PDFObject.embed(this.pdfBuilder.buildEstimatePdfTrappist1(proposal, this.invoiceCustomization, this.company, "embed"), "#pdfSpace");
    }
  }
}
