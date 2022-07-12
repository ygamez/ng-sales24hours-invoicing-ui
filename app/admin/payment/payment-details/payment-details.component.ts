import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Payment } from 'src/app/models/payment';
import { PaymentService } from 'src/app/service/payment.service';

@Component({
	selector: 'payment-details',
	templateUrl: './payment-details.component.html',
	styleUrls: ['./payment-details.component.scss']
})
export class PaymentDetailsComponent implements OnInit {
	public payment: Payment;

	constructor(private route: ActivatedRoute, private router: Router, private dataService : PaymentService) {}

	public ngOnInit(): void {
	}
}
