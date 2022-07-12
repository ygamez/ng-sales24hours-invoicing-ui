import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DebitNote } from 'src/app/models/debitnote';
import { DebitNoteService } from 'src/app/service/debitnote.service';

@Component({
	selector: 'debitnote-details',
	templateUrl: './debitnote-details.component.html',
	styleUrls: ['./debitnote-details.component.scss']
})
export class DebitNoteDetailsComponent implements OnInit {
	public debitnote: DebitNote;

	constructor(private route: ActivatedRoute, private router: Router, private dataService : DebitNoteService) {}

	public ngOnInit(): void {
	}
}
