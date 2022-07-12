import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Invoice } from 'src/app/models/invoice';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pdf-invoice',
  templateUrl: './pdf-invoice.component.html',
  styleUrls: ['./pdf-invoice.component.scss']
})
export class PdfInvoiceComponent implements OnInit {
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
	private invoiceApiUrl = environment.apiHost + '/invoice';

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
    localStorage.setItem("customerToken", this.token);
    if (router.url == "/account/checkout/completed"){
    }
  }

	public ngOnInit(): void {
    this.getInvoice();
	}

	getInvoice(){
    const headers = new HttpHeaders({"Authorization": "Bearer " + this.token});
    return this.http.get<Invoice>(this.invoiceApiUrl + '/' + this.id, { headers: headers }).subscribe(
      result => {
        this.invoice = result;
        this.customerEmail = this.invoice.customer.email;
        if (this.helper.decodeToken(this.token).customerEmail !== this.customerEmail ){
          this.router.navigateByUrl('auth/401-unauthorized');
        }
      }, error => {
        console.log(error);
    });
  }
}
