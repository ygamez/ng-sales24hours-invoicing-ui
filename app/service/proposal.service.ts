import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Proposal } from '../models/proposal';
import { ProposalLineItem } from '../models/proposallineitem';

@Injectable({ providedIn: 'root'})
export class ProposalService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/proposal';
  private lineItem: ProposalLineItem;

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<Proposal[]>{
		return this.http.get<Proposal[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<Proposal>{
		return this.http.get<Proposal>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: Proposal): Observable<Proposal> {
		return this.http.post<Proposal>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: Proposal): Observable<Proposal> {
		return this.http.put<Proposal>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<Proposal> {
		return this.http.delete<Proposal>(this.siteUrl + "/" + id, { headers: this.headers });
	}

  public deleteItem(id: number): Observable<Proposal> {
		return this.http.delete<Proposal>(this.siteUrl + "/item/" + id, { headers: this.headers });
	}

  public resend(proposal: Proposal): Observable<Proposal> {
		return this.http.post<Proposal>(this.siteUrl+"/resend", proposal, { headers: this.headers });
	}

  public send(entity: Proposal): Observable<Proposal> {
		return this.http.post<Proposal>(this.siteUrl+"/send", entity, { headers: this.headers });
	}

  public setLineItemToUpdate(item: ProposalLineItem){
    this.lineItem = item;
  }

  public getLineItemToUpdate(){
    return this.lineItem;
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

}
