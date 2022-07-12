import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CreditNote } from 'src/app/models/creditnote';
import { CreditNoteService } from 'src/app/service/creditnote.service';

@Component({
	selector: 'creditnote-details',
	templateUrl: './creditnote-details.component.html',
	styleUrls: ['./creditnote-details.component.scss']
})
export class CreditNoteDetailsComponent implements OnInit {
	public creditnote: CreditNote;

	constructor(private route: ActivatedRoute, private router: Router, private dataService : CreditNoteService) {}

	public ngOnInit(): void {
	}
}
