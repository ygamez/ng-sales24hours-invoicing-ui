import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../service/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as html2pdf from 'html2pdf.js';
import { Bill } from '../models/bill';
import { Company } from '../models/company';
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas';
import { PdfBuilderService } from '../service/pdf-builder.service';
import PDFObject from 'pdfobject'

@Component({
  selector: 'app-bill-preview',
  templateUrl: './bill-preview.component.html',
  styleUrls: ['./bill-preview.component.scss']
})
export class BillPreviewComponent implements OnInit {
  public downloading : boolean = false;
  public printing: boolean = false;
  public bill: Bill;
  private id: string = this.route.snapshot.params["id"];
  private action: string = this.route.snapshot.params["action"];
  private ready: boolean = false;
  private downloaded: boolean = false;
  token: string = this.route.snapshot.params["token"];
  tenantId: string = this.route.snapshot.params["tenantId"];
  private helper: JwtHelperService;
  private vendorEmail: string;
	private stripeApiUrl = environment.apiHost + '/stripe';
	private billApiUrl = environment.apiHost + '/bill';
  public company: Company;

  constructor(private pdfBuilder: PdfBuilderService,
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
      localStorage.setItem("customerToken", this.token);
    }

  ngAfterViewChecked(): void {
  }

	public ngOnInit(): void {
    this.getBill();

	}

	getBill(){
    const headers = new HttpHeaders({"Authorization": "Bearer " + this.token});
    return this.http.get<Bill>(this.billApiUrl + '/' + this.id, { headers: headers }).subscribe(
      result => {
        this.bill = result;
        this.vendorEmail = this.bill.vendor.email;
        if (this.helper.decodeToken(this.token).vendorEmail !== this.vendorEmail ){
          this.router.navigateByUrl('auth/401-unauthorized');
        }
        this.getCompany();

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
  //    var opt = {
  //      // margin:       1,
  //      filename:     name+'.pdf',
  //      image:        { type: 'jpeg', quality: 1 },
  //      html2canvas:  { scale: 2 },
  //      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  //    };
  //    html2pdf().set(opt).from(element).save();
  // }

  getCompany(){
    const headers = new HttpHeaders({"Authorization": "Bearer " + this.token});
    return this.http.get<Company>(environment.apiHost + '/company/tenant/' + this.tenantId, { headers: headers }).subscribe(
      result => {
        this.company = result;
        this.embedPdf();
      }, error => {
        console.log(error);
    });
  }


  dwldFromUrl(id: number){
    this.downloading = true;
    const headers = new HttpHeaders({ "Authorization": "Bearer " + this.token });
    return this.http.get(this.billApiUrl + '/download/'+id,  {
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
    return this.http.get(this.billApiUrl + '/download/'+id,  {
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
  //   window.open(this.bill.downloadUrl, '_blank');
  // }

  downloadPdf(){
    this.pdfBuilder.buildBillPdfStandard(this.bill, this.company, "save")
  }

  print(){
    this.pdfBuilder.buildBillPdfStandard(this.bill, this.company, "print");
  }

  embedPdf(){
    PDFObject.embed(this.pdfBuilder.buildBillPdfStandard(this.bill, this.company, "embed"), "#pdfSpace");
  }
}
