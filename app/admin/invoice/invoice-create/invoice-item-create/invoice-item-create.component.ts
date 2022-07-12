import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { InvoiceLineItemService } from 'src/app/service/invoicelineitem.service';
import { InvoiceLineItem } from 'src/app/models/invoicelineitem';
import { ServiceService } from 'src/app/service/service.service';
import { Service } from 'src/app/models/service';
import { TaxeService } from 'src/app/service/taxe.service';
import { Taxe } from 'src/app/models/taxe';
import { ProductService } from 'src/app/service/product.service';
import { Product } from 'src/app/models/product';
import { InvoiceService } from 'src/app/service/invoice.service';

@Component({
  selector: 'app-invoice-item-create',
  templateUrl: './invoice-item-create.component.html',
  styleUrls: ['./invoice-item-create.component.scss']
})
export class InvoiceItemCreateComponent implements OnInit {
  formTitle: string = "Add an product or service";
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
		private invoicelineitemService : InvoiceLineItemService,
    private invoiceService: InvoiceService,
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private serviceService: ServiceService,
		private taxeService: TaxeService,
		private productService: ProductService,
		private toastrService: NbToastrService,
    private dialogRef: NbDialogRef<InvoiceItemCreateComponent>){
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
	  this.getInvoiceLineItem();
		this.getService();
		this.getTaxe();
		this.getProduct();
	}

	save(entity: InvoiceLineItem) {
    this.loading = true;
		if (this.entityForm.valid && (this.product != null || this.service != null)){
      if (this.product == null) entity.productId = null;
      if (this.service == null) entity.serviceId = null;
      if(!entity.update){
        entity.product = this.product;
        entity.service = this.service;
        this.dialogRef.close(entity);
      }else{
        this.invoiceService.setLineItemToUpdate(entity);
        this.dialogRef.close(entity);
      }

		}
	}

	getInvoiceLineItem(){
		if(this.id != null && this.id !== ""){
		this.formTitle = "Update invoicelineitem";
		  let id : number = +this.id;
		  return this.invoicelineitemService.getSingle(id).subscribe(
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
    if (this.invoiceService.getLineItemToUpdate() != null){
      const itemToUpdate = this.invoiceService.getLineItemToUpdate();
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
      this.invoiceService.setLineItemToUpdate(null);
    }
  }


}
