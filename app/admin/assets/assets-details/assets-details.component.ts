import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Assets } from 'src/app/models/assets';
import { AssetsService } from 'src/app/service/assets.service';

@Component({
	selector: 'assets-details',
	templateUrl: './assets-details.component.html',
	styleUrls: ['./assets-details.component.scss']
})
export class AssetsDetailsComponent implements OnInit {
	public assets: Assets;

	constructor(private route: ActivatedRoute, private router: Router, private dataService : AssetsService) {}

	public ngOnInit(): void {
	}
}
