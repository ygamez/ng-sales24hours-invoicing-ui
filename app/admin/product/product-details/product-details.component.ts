import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/service/product.service';

@Component({
	selector: 'product-details',
	templateUrl: './product-details.component.html',
	styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
	public product: Product;

	constructor(private route: ActivatedRoute, private router: Router, private dataService : ProductService) {}

	public ngOnInit(): void {
	}
}
