import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Discount } from 'src/app/models/discount';
import { DiscountService } from 'src/app/service/discount.service';

@Component({
	selector: 'discount-details',
	templateUrl: './discount-details.component.html',
	styleUrls: ['./discount-details.component.scss']
})
export class DiscountDetailsComponent implements OnInit {
	public discount: Discount;

	constructor(private route: ActivatedRoute, private router: Router, private dataService : DiscountService) {}

	public ngOnInit(): void {
	}
}
