import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PackageElement } from '../models/package-element';

@Injectable({
  providedIn: 'root'
})
export class BuilderService {
  private headers: HttpHeaders;
  private siteUrl = environment.apiHost + '/PackageElement';

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
    });
  }

  deletePackageElement(id): Observable<PackageElement> {
      return this.http.delete<PackageElement>(this.siteUrl + "/" + id, { headers: this.headers });
  }

  addPackageElement(data): Observable<PackageElement> {
      return this.http.post<PackageElement>(this.siteUrl, data, { headers: this.headers });
  }

  updatePackageElement(data): Observable<PackageElement> {
      return this.http.put<PackageElement>(this.siteUrl, data, { headers: this.headers });
  }

  getPackageElementByID(id: string): Observable<PackageElement> {
      return this.http.get<PackageElement>(this.siteUrl + '/' + id, { headers: this.headers });
  }

  getAllPackageElements(): Observable<PackageElement[]> {
      return this.http.get<PackageElement[]>(this.siteUrl, { headers: this.headers });
  }

  generateComponents(){
    return this.http.get(this.siteUrl+ "/generate/components", { headers: this.headers });
  }

}
