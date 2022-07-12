import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/app/service/auth.service';
import { BillLineItemService } from 'src/app/service/billlineitem.service';
import { BillLineItem } from 'src/app/models/billlineitem';
import { ServiceService } from 'src/app/service/service.service';
import { Service } from 'src/app/models/service';
import { TaxeService } from 'src/app/service/taxe.service';
import { Taxe } from 'src/app/models/taxe';
import { ProductService } from 'src/app/service/product.service';
import { Product } from 'src/app/models/product';
import { BillService } from 'src/app/service/bill.service';

@Component({
  selector: 'app-bill-item-create',
  templateUrl: './bill-item-create.component.html',
  styleUrls: ['./bill-item-create.component.scss']
})
export class BillItemCreateComponent implements OnInit {

	entityForm: FormGroup;
	loading: boolean = false;
	id: string = this.activatedRoute.snapshot.params["id"];
	public services: Service[] = [];
	public taxes: Taxe[] = [];
	public products: Product[] = [];
  public isProduct: boolean = true;
  public product: Product;
  public service: Service;

	constructor(
		private billlineitemService : BillLineItemService,
    private billService: BillService,
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private serviceService: ServiceService,
		private taxeService: TaxeService,
		private productService: ProductService,
		private toastrService: NbToastrService,
    private dialogRef: NbDialogRef<BillItemCreateComponent>){
		this.entityForm = this.fb.group({
		  description: '',
		  category: ['product',[Validators.required]],
		  serviceId:'',
		  price: '',
		  totalPrice: '',
		  discount: 0,
		  quantity: 1,
		  productId: '',
      update:false,
		});
    this.getItemToUpdate();
	}

	ngOnInit(): void {
	  this.getBillLineItem();
		this.getService();
		this.getTaxe();
		this.getProduct();
	}

	save(entity: BillLineItem) {
    this.loading = true;
		if (this.entityForm.valid && (this.product != null || this.service != null)){
      if (this.product == null) entity.productId = null;
      if (this.service == null) entity.serviceId = null;
      if(!entity.update){
        entity.product = this.product;
        entity.service = this.service;
        this.dialogRef.close(entity);
      }else{
        this.billService.setLineItemToUpdate(entity);
        this.dialogRef.close(entity);
      }

		}
	}

	getBillLineItem(){
		if(this.id != null && this.id !== ""){
		  let id : number = +this.id;
		  return this.billlineitemService.getSingle(id).subscribe(
		    result => {
		      this.entityForm.patchValue(result);
		    }, error => {
		      console.log(error);
		    }
		  );
		}
	}

	getService(){
	  return this.serviceService.getAll().subscribe( result => {
	    this.services = result;
	  }, error => {
	    console.log(error);
	  });
	}

	getTaxe(){
	  return this.taxeService.getAll().subscribe( result => {
	    this.taxes = result;
	  }, error => {
	    console.log(error);
	  });
	}

	getProduct(){
	  return this.productService.getAll().subscribe( result => {
	    this.products = result;
	  }, error => {
	    console.log(error);
	  });
	}

	showToast(status: NbComponentStatus, message: string): void {
		this.toastrService.show(status, message, { status, duration:4000 });
	}

  selectedCategory(value){
    if (value === 'product'){
      this.isProduct = true;
    }else {
      this.isProduct = false;
    }
    this.setupItem();
  }

  close() {
    this.dialogRef.close();
  }

  selectProduct(id){
    this.product = this.products.find(x => x.id === id);
    this.setupItem();
  }

  selectService(id){
    this.service = this.services.find(x => x.id === id);
    this.setupItem();
  }

  setupItem(){
    var price = this.entityForm.get('price');
    var quantity = this.entityForm.get('quantity');
    var totalPrice = this.entityForm.get('totalPrice');
    if (this.isProduct && this.product != null){
      price.setValue(this.product.salePrice);
      this.service = null;
    }else if (!this.isProduct && this.service != null){
      price.setValue(this.service.salePrice);
      this.product = null;
    }
    var totalPriceValue = price.value * quantity.value;
    totalPrice.setValue(totalPriceValue);
  }

  quantityChange(ev){
    var  qte = ev.target.value;
    var price = this.entityForm.get('price');
    var totalPrice = this.entityForm.get('totalPrice');
    totalPrice.setValue(price.value * qte);
  }

  getItemToUpdate(){
    if (this.billService.getLineItemToUpdate() != null){
      const itemToUpdate = this.billService.getLineItemToUpdate();
      this.product = itemToUpdate.product;
      this.service = itemToUpdate.service;
      if (this.product != null){
        this.isProduct = true;
        this.service = null;
      }else {
        this.isProduct = false;
        this.product = null;
      }
      this.entityForm.patchValue(itemToUpdate);
      this.billService.setLineItemToUpdate(null);
    }
  }

}
