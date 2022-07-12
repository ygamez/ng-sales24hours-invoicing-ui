import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Transaction } from 'src/app/models/transaction';
import { TransactionService } from 'src/app/service/transaction.service';

@Component({
	selector: 'transaction-details',
	templateUrl: './transaction-details.component.html',
	styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements OnInit {
	public transaction: Transaction;

	constructor(private route: ActivatedRoute, private router: Router, private dataService : TransactionService) {}

	public ngOnInit(): void {
	}
}
