import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Bill } from '../models/bill';
import { BillLineItem } from '../models/billlineitem';

@Injectable({ providedIn: 'root'})
export class BillService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/bill';
  private lineItem : BillLineItem;
  private lineItems : BillLineItem[];

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<Bill[]>{
		return this.http.get<Bill[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<Bill>{
		return this.http.get<Bill>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: Bill): Observable<Bill> {
		return this.http.post<Bill>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: Bill): Observable<Bill> {
		return this.http.put<Bill>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<Bill> {
		return this.http.delete<Bill>(this.siteUrl + "/" + id, { headers: this.headers });
	}

  public deleteItem(id: number): Observable<Bill> {
		return this.http.delete<Bill>(this.siteUrl + "/item/" + id, { headers: this.headers });
	}

  public send(bill: Bill): Observable<Bill> {
		return this.http.post<Bill>(this.siteUrl+"/send", bill, { headers: this.headers });
	}

  public resend(bill: Bill): Observable<Bill> {
		return this.http.post<Bill>(this.siteUrl+"/resend", bill, { headers: this.headers });
	}

  public setLineItemToUpdate(item: BillLineItem){
    this.lineItem = item;
  }

  public getLineItemToUpdate(){
    return this.lineItem;
  }

  public download(id: number){
		return this.http.get(this.siteUrl + '/download/' + id,  {
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

}
