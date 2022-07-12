import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Customer } from 'src/app/models/customer';
import { CustomerService } from 'src/app/service/customer.service';

@Component({
	selector: 'customer-details',
	templateUrl: './customer-details.component.html',
	styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {
	public customer: Customer;

	constructor(private route: ActivatedRoute, private router: Router, private dataService : CustomerService) {}

	public ngOnInit(): void {
	}
}
