import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

// const url = 'https://localhost:44332/api/customer?q=ernesto.yariel@gmail.com';
export class EmailValidatorService implements AsyncValidator {
  headers: HttpHeaders;
  siteUrl: string = environment.apiHost + '/customer';;

  constructor( private http: HttpClient ) {
    this.headers = new HttpHeaders({"Authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).token});
   }
   
  validate(control: AbstractControl): Observable<ValidationErrors> | null{
    const email = control.value;
    console.log( email );
    
    return this.http.get<any[]>(`${this.siteUrl}?email=${email}`, { headers: this.headers })
  }
}
