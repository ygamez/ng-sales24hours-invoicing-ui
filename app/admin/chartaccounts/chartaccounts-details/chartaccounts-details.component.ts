import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChartAccounts } from 'src/app/models/chartaccounts';
import { ChartAccountsService } from 'src/app/service/chartaccounts.service';

@Component({
	selector: 'chartaccounts-details',
	templateUrl: './chartaccounts-details.component.html',
	styleUrls: ['./chartaccounts-details.component.scss']
})
export class ChartAccountsDetailsComponent implements OnInit {
	public chartaccounts: ChartAccounts;

	constructor(private route: ActivatedRoute, private router: Router, private dataService : ChartAccountsService) {}

	public ngOnInit(): void {
	}
}
