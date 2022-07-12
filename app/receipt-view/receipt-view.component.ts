import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { Company } from '../models/company';
import { Invoice } from '../models/invoice';
import { Receipt } from '../models/receipt';
import { AuthService } from '../service/auth.service';
import { jsPDF } from 'jspdf'
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-receipt-view',
  templateUrl: './receipt-view.component.html',
  styleUrls: ['./receipt-view.component.scss']
})
export class ReceiptViewComponent implements OnInit {
  // Get invoice api url
	private invoiceApiUrl = environment.apiHost + '/invoice';
  //Get the token for the api
  private token: string = this.route.snapshot.params["token"];
  //Get invoice id in url
  private id: string = this.route.snapshot.params["id"];
  public invoice: Invoice;
  private customerEmail: string;
  private helper: JwtHelperService;
  //Get receiptId in url
  private receiptId: number = this.route.snapshot.params["receiptId"];
  public receipt: Receipt;
  public company: Company;
  public downloading: boolean = false;
  public printing: boolean = false;

  constructor(
     private http: HttpClient,
     private authService: AuthService,
     private router: Router,
     private route: ActivatedRoute) {
      this.helper = new JwtHelperService();

      if (this.token == null){
        this.router.navigateByUrl('auth/401-unauthorized');
      }else if (this.helper.isTokenExpired(this.token)){
        this.router.navigateByUrl('auth/401-unauthorized');
      }
  }

  ngOnInit() {
    this.getInvoice();
  }

	getInvoice(){
    const headers = new HttpHeaders({"Authorization": "Bearer " + this.token});
    return this.http.get<Invoice>(this.invoiceApiUrl + '/' + this.id, { headers: headers }).subscribe(
      result => {
        this.invoice = result;
        this.receipt = result.revenues.find(x => x.receipt.id == this.receiptId).receipt;
        this.customerEmail = this.invoice.customer.email;
        if (this.helper.decodeToken(this.token).customerEmail !== this.customerEmail ){
          this.router.navigateByUrl('auth/401-unauthorized');
        }
        this.getCompany();

      }, error => {
        console.log(error);
    });
  }

  getCompany(){
    const headers = new HttpHeaders({"Authorization": "Bearer " + this.token});
    return this.http.get<Company>(environment.apiHost + '/company/tenant/' + this.invoice.createdBy.tenantId, { headers: headers }).subscribe(
      result => {
        this.company = result;
      }, error => {
        console.log(error);
    });
  }

  printPdf(){
    this.printing = true;
    var data = document.getElementById('pdfContent') as HTMLElement;
    const doc = new jsPDF("p", "mm", "a4");
    doc.html("data");
    // doc.autoPrint();
    doc.output("dataurlnewwindow");
    this.printing = false;
  }

  downloadPdf(name){
    this.downloading = true;
    name = name + "_Receipt"
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
    this.downloading = false;

  }

}
