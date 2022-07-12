import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Transfer } from 'src/app/models/transfer';
import { TransferService } from 'src/app/service/transfer.service';

@Component({
	selector: 'transfer-details',
	templateUrl: './transfer-details.component.html',
	styleUrls: ['./transfer-details.component.scss']
})
export class TransferDetailsComponent implements OnInit {
	public transfer: Transfer;

	constructor(private route: ActivatedRoute, private router: Router, private dataService : TransferService) {}

	public ngOnInit(): void {
	}
}
