import { Component, OnInit } from '@angular/core';
// import { Product } from 'src/app/@core/data/product';

@Component({
  selector: 'app-best-selling-product',
  templateUrl: './best-selling-product.component.html',
  styleUrls: ['./best-selling-product.component.scss']
})
export class BestSellingProductComponent implements OnInit {
  products = [
    {
      name:'Iconic watch',
      color:'White',
      createdOn: '01/01/2020',
      image:'assets/images/watch-white.jpg',
      category:'Accessories',
      status:'online',
      quantity: 289,
      price: 89,
      state: '',
      reference: ''
    },
    {
      name:'Iconic glass',
      color:'Black',
      createdOn: '01/01/2020',
      image:'assets/images/glass.jpg',
      category:'Accessories',
      status:'online',
      quantity: 325,
      price: 89,
      state: '',
      reference: ''
    },
    {
      name:'Iconic bike',
      color:'Black',
      createdOn: '01/01/2020',
      image:'assets/images/bike.jpg',
      category:'Sport',
      status:'offline',
      quantity: 325,
      state: '',
      reference: '',
      price: 29
    },
    {
      name:'Iconic headphone',
      color:'Pink',
      createdOn: '01/01/2020',
      image:'assets/images/headphone.jpg',
      category:'Multimedia',
      status:'online',
      quantity: 325,
      state: '',
      reference: '',
      price: 29
    },
    {
      name:'Iconic basket',
      color:'Black',
      createdOn: '01/01/2020',
      image:'assets/images/basket.jpg',
      category:'Shoes',
      status:'offline',
      quantity: 325,
      state: '',
      reference: '',
      price: 29
    }
  ];

  totalPrice: number = 0;

  constructor() {
    for(let product of this.products){
       this.totalPrice = this.totalPrice + (product.price * product.quantity)
    }
  }

  ngOnInit(): void {
  }

}
