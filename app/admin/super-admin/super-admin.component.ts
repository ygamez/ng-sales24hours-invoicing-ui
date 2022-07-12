import { Component, OnInit } from '@angular/core';
import { SUPER_ADMIN_CONSOLE_MENUS } from 'src/assets/translate/console-menu';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.scss']
})
export class SuperAdminComponent implements OnInit {
  lang: string = localStorage.getItem('lang') != null ? localStorage.getItem('lang') : 'en';
  menus = SUPER_ADMIN_CONSOLE_MENUS[this.lang];

  constructor() { }

  ngOnInit() {
  }

}
