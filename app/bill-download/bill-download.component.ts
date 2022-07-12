import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '../service/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as html2pdf from 'html2pdf.js';
import { Bill } from '../models/bill';
import { Company } from '../models/company';
import { jsPDF } from 'jspdf'
import { BillService } from '../service/bill.service';
import { CompanyService } from '../service/company.service';

@Component({
  selector: 'app-bill-download',
  templateUrl: './bill-download.component.html',
  styleUrls: ['./bill-download.component.scss']
})
export class BillDownloadComponent implements OnInit {
  public bill: Bill;
  private id: string = this.route.snapshot.params["id"];
  private ready: boolean = false;
  private downloaded: boolean = false;
  token: string = this.route.snapshot.params["token"];
  tenantId: string = this.route.snapshot.params["tenantId"];
  @ViewChild('pdf') pdf: ElementRef;
  company: Company;

  constructor(private billService: BillService,
    private _authService: AuthService,
    private companyService: CompanyService,
    private route: ActivatedRoute) { }

  ngAfterViewChecked(): void {
    if(this.ready && !this.downloaded){
      this.downloadPdf(this.bill.reference);
      setTimeout(() =>{
        window.close();
      }, 2000);
    }
    console.log(this.ready)
  }

  public ngOnInit(): void {
    this.getBill();

	}

	getBill(){
    return this.billService.getSingle(+this.id).subscribe(
      result => {
        this.bill = result;
        if (this.bill != null){

          this.getCompany();
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
  }

  getCompany(){
    var tenantId = this._authService.getCurrentUser().tenantId;
    this.companyService.getByTenant(tenantId).subscribe(
      result => {
        this.company = result;
        this.ready = true;
      }, error => {
        console.log(error);
      }
    )
  }
}
