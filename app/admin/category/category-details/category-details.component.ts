import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/service/category.service';

@Component({
	selector: 'category-details',
	templateUrl: './category-details.component.html',
	styleUrls: ['./category-details.component.scss']
})
export class CategoryDetailsComponent implements OnInit {
	public category: Category;

	constructor(private route: ActivatedRoute, private router: Router, private dataService : CategoryService) {}

	public ngOnInit(): void {
	}
}
