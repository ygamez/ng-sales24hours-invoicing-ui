import { AfterViewChecked, Component, ElementRef,  OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Proposal } from '../models/proposal';
import * as html2pdf from 'html2pdf.js';
import { ProposalService } from '../service/proposal.service';
import { CompanyService } from '../service/company.service';
import { AuthService } from '../service/auth.service';
import { Company } from '../models/company';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { InvoiceCustomization } from '../models/invoice-customization';

@Component({
  selector: 'app-estimate-download2',
  templateUrl: './estimate-download2.component.html',
  styleUrls: ['./estimate-download2.component.scss']
})
export class EstimateDownload2Component implements OnInit {
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
  customization: InvoiceCustomization;

  constructor(private proposalService: ProposalService,
    private companyService: CompanyService,
    private http: HttpClient,
    private router: Router,
    private _authService : AuthService,
    private route: ActivatedRoute) {
      this.helper = new JwtHelperService();
      if (this.token && this.helper.isTokenExpired(this.token)){
        this.router.navigateByUrl('auth/401-unauthorized');
      }
      localStorage.setItem("customerToken", this.token);
     }

  ngAfterViewChecked(): void {
    if(this.ready && !this.downloaded){
      this.downloadPdf(this.proposal.reference);

    }
    console.log(this.ready)
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
        this.getCompany();
        if (this.token && this.helper.decodeToken(this.token).customerEmail !== this.customerEmail ){
          this.router.navigateByUrl('auth/401-unauthorized');
        }
        this.getInvoiceCustomizationInfos();
      }, error => {
        console.log(error);
    });
  }

  downloadPdf(name){
    var element = document.getElementById('pdfContent');
    // This will implicitly create the canvas and PDF objects before saving.
     var opt = {
       // margin:       1,
       filename:     name+'.pdf',
       image:        { type: 'jpeg', quality: 1 },
       html2canvas:  { scale: 2 },
       jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
     };
     html2pdf().set(opt).from(element).save();
     this.downloaded = true;
     setTimeout(() =>{
      window.close();
    }, 2000);
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

  getInvoiceCustomizationInfos(){
    const headers = new HttpHeaders({ "Authorization": "Bearer " + this.token });
    return  this.http.get<InvoiceCustomization>(this.invoiceApiUrl + '/customization/tenant/'+this.tenantId, { headers: headers }).subscribe(
      result => {
        if (result != null) {
          this.customization = result;
          this.ready = true;
        }
      }, error => {
        console.log(error);
      }
    );
  }
}
