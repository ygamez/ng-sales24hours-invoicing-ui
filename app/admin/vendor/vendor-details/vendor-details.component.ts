import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Vendor } from 'src/app/models/vendor';
import { VendorService } from 'src/app/service/vendor.service';

@Component({
	selector: 'vendor-details',
	templateUrl: './vendor-details.component.html',
	styleUrls: ['./vendor-details.component.scss']
})
export class VendorDetailsComponent implements OnInit {
	public vendor: Vendor;

	constructor(private route: ActivatedRoute, private router: Router, private dataService : VendorService) {}

	public ngOnInit(): void {
	}
}
