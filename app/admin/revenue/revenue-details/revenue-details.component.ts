import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Revenue } from 'src/app/models/revenue';
import { RevenueService } from 'src/app/service/revenue.service';

@Component({
	selector: 'revenue-details',
	templateUrl: './revenue-details.component.html',
	styleUrls: ['./revenue-details.component.scss']
})
export class RevenueDetailsComponent implements OnInit {
	public revenue: Revenue;

	constructor(private route: ActivatedRoute, private router: Router, private dataService : RevenueService) {}

	public ngOnInit(): void {
	}
}
