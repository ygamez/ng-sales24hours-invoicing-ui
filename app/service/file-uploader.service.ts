import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploaderService {
  private headers: HttpHeaders;
  private siteUrl = environment.apiHost + '/uploader';

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
    });
  }

  public uploadLogo(file): Observable<string> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<string>(this.siteUrl+'/logo', formData, { headers: this.headers });
  }

  public uploadFavicon(file): Observable<string> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<string>(this.siteUrl+'/favicon', formData, { headers: this.headers });
  }

  public delete(fileType: string): Observable<string> {
		return this.http.delete<string>(this.siteUrl + "/" + fileType, { headers: this.headers });
	}
}
