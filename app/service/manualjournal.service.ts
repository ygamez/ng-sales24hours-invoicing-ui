import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ManualJournal } from '../models/manualjournal';
import { ManualJournalLineItem } from '../models/manualjournallineitem';

@Injectable({ providedIn: 'root'})
export class ManualJournalService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/manualjournal';
  private lineItem:ManualJournalLineItem;

	constructor(private http: HttpClient) {
		this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
	}

	public getAll(): Observable<ManualJournal[]>{
		return this.http.get<ManualJournal[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<ManualJournal>{
		return this.http.get<ManualJournal>(this.siteUrl + '/' + id, { headers: this.headers });
	}

	public create(entity: ManualJournal): Observable<ManualJournal> {
		return this.http.post<ManualJournal>(this.siteUrl, entity, { headers: this.headers });
	}

	public update(entity: ManualJournal): Observable<ManualJournal> {
		return this.http.put<ManualJournal>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<ManualJournal> {
		return this.http.delete<ManualJournal>(this.siteUrl + "/" + id, { headers: this.headers });
	}

  public deleteItem(id: number): Observable<ManualJournal> {
		return this.http.delete<ManualJournal>(this.siteUrl + "/item/" + id, { headers: this.headers });
	}

  public send(entity: ManualJournal): Observable<ManualJournal> {
		return this.http.post<ManualJournal>(this.siteUrl+"/send", entity, { headers: this.headers });
	}

  public resend(entity: ManualJournal): Observable<ManualJournal> {
		return this.http.post<ManualJournal>(this.siteUrl+"/resend", entity, { headers: this.headers });
	}

  public setLineItemToUpdate(item: ManualJournalLineItem){
    this.lineItem = item;
  }

  public getLineItemToUpdate(){
    return this.lineItem;
  }
}
