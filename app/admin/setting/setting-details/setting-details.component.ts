import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Setting } from 'src/app/models/setting';
import { SettingService } from 'src/app/service/setting.service';

@Component({
	selector: 'setting-details',
	templateUrl: './setting-details.component.html',
	styleUrls: ['./setting-details.component.scss']
})
export class SettingDetailsComponent implements OnInit {
	public setting: Setting;

	constructor(private route: ActivatedRoute, private router: Router, private dataService : SettingService) {}

	public ngOnInit(): void {
	}
}
