import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Taxe } from 'src/app/models/taxe';
import { TaxeService } from 'src/app/service/taxe.service';

@Component({
	selector: 'taxe-details',
	templateUrl: './taxe-details.component.html',
	styleUrls: ['./taxe-details.component.scss']
})
export class TaxeDetailsComponent implements OnInit {
	public taxe: Taxe;

	constructor(private route: ActivatedRoute, private router: Router, private dataService : TaxeService) {}

	public ngOnInit(): void {
	}
}
