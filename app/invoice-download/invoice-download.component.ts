import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Invoice } from '../models/invoice';
import { InvoiceService } from '../service/invoice.service';
import * as html2pdf from 'html2pdf.js';
import { AuthService } from '../service/auth.service';
import { CompanyService } from '../service/company.service';
import { Company } from '../models/company';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { InvoiceCustomization } from '../models/invoice-customization';

@Component({
  selector: 'app-invoice-download',
  templateUrl: './invoice-download.component.html',
  styleUrls: ['./invoice-download.component.scss']
})
export class InvoiceDownloadComponent implements OnInit {
  public invoice: Invoice;
  private id: string = this.route.snapshot.params["id"];
  private ready: boolean = false;
  private downloaded: boolean = false;
  token: string = this.route.snapshot.params["token"];
  tenantId: string = this.route.snapshot.params["tenantId"];
  @ViewChild('pdf') pdf: ElementRef;
  company: Company;
  private invoiceApiUrl = environment.apiHost + '/invoice';
  private customerEmail: string;
  private helper: JwtHelperService;
  public customization: InvoiceCustomization;

  constructor(private invoiceService: InvoiceService,
    private _authService: AuthService,
    private companyService: CompanyService,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute) {
      this.helper = new JwtHelperService();
    if (this.token == null) {
      this.router.navigateByUrl('auth/401-unauthorized');
    } else if (this.helper.isTokenExpired(this.token)) {
      this.router.navigateByUrl('auth/401-unauthorized');
    }
    localStorage.setItem("customerToken", this.token);
     }

  ngAfterViewChecked(): void {
    if(this.ready && !this.downloaded){
      this.downloadPdf(this.invoice.reference);
    }
    console.log(this.ready)
  }

  public ngOnInit(): void {
    this.getInvoice();
    this.getCompany();

	}

	getInvoice(){
    const headers = new HttpHeaders({ "Authorization": "Bearer " + this.token });
    return this.http.get<Invoice>(this.invoiceApiUrl + '/' + this.id, { headers: headers }).subscribe(
      result => {
        this.getInvoiceCustomizationInfos();
        this.invoice = result;
        this.customerEmail = this.invoice.customer.email;
        if (this.helper.decodeToken(this.token).customerEmail !== this.customerEmail) {
          this.router.navigateByUrl('auth/401-unauthorized');
        }
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
