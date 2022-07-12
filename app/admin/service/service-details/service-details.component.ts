import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Service } from 'src/app/models/service';
import { ServiceService } from 'src/app/service/service.service';

@Component({
	selector: 'service-details',
	templateUrl: './service-details.component.html',
	styleUrls: ['./service-details.component.scss']
})
export class ServiceDetailsComponent implements OnInit {
	public service: Service;

	constructor(private route: ActivatedRoute, private router: Router, private dataService : ServiceService) {}

	public ngOnInit(): void {
	}
}
