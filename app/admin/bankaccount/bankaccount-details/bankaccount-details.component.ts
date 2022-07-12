import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BankAccount } from 'src/app/models/bankaccount';
import { BankAccountService } from 'src/app/service/bankaccount.service';

@Component({
	selector: 'bankaccount-details',
	templateUrl: './bankaccount-details.component.html',
	styleUrls: ['./bankaccount-details.component.scss']
})
export class BankAccountDetailsComponent implements OnInit {
	public bankaccount: BankAccount;

	constructor(private route: ActivatedRoute, private router: Router, private dataService : BankAccountService) {}

	public ngOnInit(): void {
	}
}
