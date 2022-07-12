import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OwnedAttribute } from '../models/owned-attribute';

@Injectable({
  providedIn: 'root'
})
export class FieldService {
  private ownedAttribute: OwnedAttribute;
  private ownedAttributes: OwnedAttribute[] = [];
  private headers: HttpHeaders;
  private siteUrl = environment.apiHost + '/OwnedAttribute';
  attrIndexUpdate;


  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
    });
  }

  deleteOwnedAttribute(id): Observable<OwnedAttribute> {
      return this.http.delete<OwnedAttribute>(this.siteUrl + "/" + id, { headers: this.headers });
  }

  addOwnedAttribute(data): Observable<OwnedAttribute> {
      return this.http.post<OwnedAttribute>(this.siteUrl, data, { headers: this.headers });
  }

  updateOwnedAttribute(data): Observable<OwnedAttribute> {
      return this.http.put<OwnedAttribute>(this.siteUrl, data, { headers: this.headers });
  }

  getOwnedAttributeByID(id: string): Observable<OwnedAttribute> {
      return this.http.get<OwnedAttribute>(this.siteUrl + '/' + id, { headers: this.headers });
  }

  getAllOwnedAttributes(): Observable<OwnedAttribute[]> {
      return this.http.get<OwnedAttribute[]>(this.siteUrl, { headers: this.headers });
  }

  setOwnedAttributeToUpdate(data){
    this.attrIndexUpdate = this.ownedAttributes.indexOf(data);
    this.ownedAttribute = data;
  }

  getOwnedAttributeToUpdate():OwnedAttribute{
    return this.ownedAttribute;
  }

  addFormOwnedAttribute(data: OwnedAttribute){
    if (this.attrIndexUpdate == undefined || (this.ownedAttributes.find(x => x.name == data.name) == null)){
      this.ownedAttributes.push(data)
    }else{
      this.ownedAttributes[this.attrIndexUpdate] = data;
      this.attrIndexUpdate == undefined
    }
  }

  setAttributeUpdateIndex(value){
    this.attrIndexUpdate = value;
  }

  getAttributeIndex(){
    return this.attrIndexUpdate;
  }

  setFormOwnedAttributes(data){
    this.ownedAttributes = data;
  }

  getFormOwnedAttributes():OwnedAttribute[]{
    return this.ownedAttributes;
  }

  deleteFormOwnedAttributes(data){
    this.ownedAttributes.splice(this.ownedAttributes.indexOf(data), 1)
  }

}
