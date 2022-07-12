import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Setting } from '../models/setting';
import { map } from 'rxjs/operators';


@Injectable({ providedIn: 'root'})
export class SettingService {
	private headers: HttpHeaders;
	private siteUrl = environment.apiHost + '/setting';

	constructor(private http: HttpClient) {}

	public getAll(): Observable<Setting[]>{
		return this.http.get<Setting[]>(this.siteUrl, { headers: this.headers });
	}

	public getDataSize() {
		return this.http.get(this.siteUrl + '/size', { headers: this.headers });
	}

	public getSingle(id: number): Observable<Setting>{
		return this.http.get<Setting>(this.siteUrl + '/' + id, { headers: this.headers });
	}

  public getByType(type: string): Observable<Setting>{
    this.headers = new HttpHeaders({"settingKey": environment.publicSettingKey});
		return this.http.get<Setting>(this.siteUrl + '/type/' + type, { headers: this.headers });
	}

  public getByToken(type: string, token: string): Observable<Setting>{
    this.headers = new HttpHeaders({"Authorization": "Bearer " + token});
		return this.http.get<Setting>(this.siteUrl + '/type/' + type, { headers: this.headers });
	}

	public create(entity: Setting): Observable<Setting> {
		return this.http.post<Setting>(this.siteUrl, entity, { headers: this.headers });
	}

  public sendTestMail(): Observable<Setting> {
    this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
		return this.http.post<Setting>(this.siteUrl+"/send/test-mail", {}, { headers: this.headers });
	}

	public update(entity: Setting): Observable<Setting> {
    this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
		return this.http.put<Setting>(this.siteUrl, entity, { headers: this.headers });
	}

	public delete(id: number): Observable<Setting> {
		return this.http.delete<Setting>(this.siteUrl + "/" + id, { headers: this.headers });
	}

  public getJsonSetting(): Observable<any>{
		return this.http.get<any>('./assets/json/setting.json');
	}

  public getCountriesAndCurrencies(): Observable<any>{
		return this.http.get<any>('./assets/json/countries.json');
	}

  public activatedLicense(entity: Setting): Observable<Setting> {
    this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
		return this.http.post<Setting>(this.siteUrl+"/license/activate", entity, { headers: this.headers });
	}

  public getLicense(type: string): Observable<boolean>{
    this.headers = new HttpHeaders({"settingKey": environment.publicSettingKey});
		return this.http.get<Setting>(this.siteUrl + '/type/' + type, { headers: this.headers }).pipe(
      map(
        setting => {
          if (setting != null){
            if (setting.licenseType === "e5b467c4-4a0f-435d-a889-c7b14033f671") {
              return true;
            }
            else {
              return false;
            }
          }
          return false;
        }
      )
    );
	}

  public updateJsonSetting(entity: any): Observable<any> {
		return this.http.put<any>('./assets/json/setting.json', entity);
	}

}
