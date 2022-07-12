import { Component, OnInit } from '@angular/core';
import { REPORT_MENUS } from 'src/assets/translate/report-menu';
import { REPORT_MENU } from './report-menu';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  lang: string = localStorage.getItem('lang') != null ? localStorage.getItem('lang') : 'en';
  menus  = REPORT_MENUS[this.lang];

  constructor() { }

  ngOnInit() {
  }

}
