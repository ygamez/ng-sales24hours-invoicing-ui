import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Invoice } from '../models/invoice';
import { InvoiceCustomization } from '../models/invoice-customization';
import { InvoiceLineItem } from '../models/invoicelineitem';
import { TranslateService } from '@ngx-translate/core';
import { DateService } from './date.service';

@Injectable({ providedIn: 'root'})
export class InvoiceService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/invoice';
  private lineItem : InvoiceLineItem;
  private invoice: Invoice;
  private noteAndTerms: string;

	constructor(private http: HttpClient, private translate: TranslateService, private dateService: DateService) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<Invoice[]>{
		return this.http.get<Invoice[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<Invoice>{
		return this.http.get<Invoice>(this.siteUrl + '/' + id, { headers: this.headers });
	}

  public getSingleByToken(id: number, token: string): Observable<Invoice>{
    const header = new HttpHeaders({"Authorization": "Bearer " + token})
		return this.http.get<Invoice>(this.siteUrl + '/' + id, { headers: header });
	}

	public create(entity: Invoice): Observable<Invoice> {
		return this.http.post<Invoice>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: Invoice): Observable<Invoice> {
		return this.http.put<Invoice>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<Invoice> {
		return this.http.delete<Invoice>(this.siteUrl + "/" + id, { headers: this.headers });
	}

  public deleteItem(id: number): Observable<Invoice> {
		return this.http.delete<Invoice>(this.siteUrl + "/item/" + id, { headers: this.headers });
	}

  public send(entity: Invoice): Observable<Invoice> {
		return this.http.post<Invoice>(this.siteUrl+"/send", entity, { headers: this.headers });
	}

  public sendReminder(entity: Invoice): Observable<Invoice> {
		return this.http.post<Invoice>(this.siteUrl+"/reminder/send", entity, { headers: this.headers });
	}

  public resend(entity: Invoice): Observable<Invoice> {
		return this.http.post<Invoice>(this.siteUrl+"/resend", entity, { headers: this.headers });
	}

  public sendReceipt(entity: Invoice, receiptId): Observable<Invoice> {
		return this.http.post<Invoice>(this.siteUrl+"/receipt/"+receiptId+"/send", entity, { headers: this.headers });
	}

  public download(id: number, invoiceName: string){
		return this.http.get(this.siteUrl + '/download/' + id+'/name/'+invoiceName,  {
      headers: this.headers,
      reportProgress: true,
      responseType: 'blob',
    });
	}

  downLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type});
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
        alert( 'Please disable your Pop-up blocker and try again.');
    }
  }

  public convertCurrency(from: string, to: string, amount: number): Observable<any>{
    return this.http.get<any>(this.siteUrl + '/convert/currency/from/' + from + '/to/' + to + '/amount/' + amount, { headers: this.headers });
  }

  public setLineItemToUpdate(item: InvoiceLineItem){
    this.lineItem = item;
  }

  public getLineItemToUpdate(){
    return this.lineItem;
  }

  public setInvoice(item: Invoice){
    this.invoice = item;
  }

  public getInvoice(){
    return this.invoice;
  }

  public getCustomizationInfos(id: number): Observable<InvoiceCustomization> {
		return this.http.get<InvoiceCustomization>(this.siteUrl + '/customization/tenant/'+id, { headers: this.headers });
	}

  public updateCustomizationInfos(entity: InvoiceCustomization): Observable<InvoiceCustomization> {
		return this.http.put<InvoiceCustomization>(this.siteUrl + '/customization', entity, { headers: this.headers });
	}


}
