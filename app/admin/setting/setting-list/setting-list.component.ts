
import { Component, OnInit } from '@angular/core';
import { COMPANY_SETTINGS_MENUS } from 'src/assets/translate/company-setting-menu';

@Component({
	selector: 'setting-list',
	templateUrl: './setting-list.component.html',
	styleUrls: ['./setting-list.component.scss']
})
export class SettingListComponent implements OnInit {
  lang: string = localStorage.getItem('lang') != null ? localStorage.getItem('lang') : 'en';
  menus  = COMPANY_SETTINGS_MENUS[this.lang];
	constructor() {}
	ngOnInit(): void {}
}
