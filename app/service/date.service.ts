import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common'

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor(public datepipe: DatePipe) { }

  getCurrentDate():string{
    let date = new Date();
    let year = date.getFullYear();
    let month = String(date.getMonth()+1).padStart(2, '0');
    let dd = String(date.getDate()).padStart(2,'0');
    let hh = String(date.getHours()).padStart(2,'0');
    let min = String(date.getMinutes()).padStart(2,'0');
    let ss = String(date.getSeconds()).padStart(2,'0');
    return year+"-"+month+"-"+dd+"T"+hh+":"+min+":"+ss;
  }

  adjustDateForTimeOffset(date : Date) {
    var offsetMs = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offsetMs);
  }

  formatDateTime(date: Date){
    return this.datepipe.transform(date, 'yyyy-MM-dd HH:mm:ss');
  }

  formatDate(date: Date){
  return this.datepipe.transform(date, 'yyyy-MM-dd');
  }
}
