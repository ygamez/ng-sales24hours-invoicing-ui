import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Currency } from 'src/app/models/currency';
import { CurrencyService } from 'src/app/service/currency.service';

@Component({
	selector: 'currency-details',
	templateUrl: './currency-details.component.html',
	styleUrls: ['./currency-details.component.scss']
})
export class CurrencyDetailsComponent implements OnInit {
	public currency: Currency;

	constructor(private route: ActivatedRoute, private router: Router, private dataService : CurrencyService) {}

	public ngOnInit(): void {
	}
}
