import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/app/service/auth.service';
import { CustomerService } from 'src/app/service/customer.service';
import { Customer } from 'src/app/models/customer';
import { AddressService } from 'src/app/service/address.service';
import { Address } from 'src/app/models/address';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'customer-create',
	templateUrl: './customer-create.component.html',
	styleUrls: ['./customer-create.component.scss']
})
export class CustomerCreateComponent implements OnInit {
	formTitle: string = "Add new customer";
	entityForm: FormGroup;
	loading: boolean = false;
	id: string = this.activatedRoute.snapshot.params["id"];
	public addresss: Address[] = [];
  public errorMessage: string;
  public deletedItem: string;
	public addItem: string;
	public updateItem: string;
	public addedCustomer: string;
	public modifiedCustomer: string;
	public deletedCustomer: string;
	public success: string;

	// @ViewChild('formDir') formDir: NgForm;

	customerResponse : Customer = {
		id: 0,
		createdById: 0,
		createdAt: undefined,
		updateAt: undefined,
		email: '',
		name: '',
		ruc: '',
		phone: '',
		password: '',
		billingAddressId: 0,
		shippingAddressId: 0,
		shippingAddress: new Address
	}
	btnNewCustomer: any;
	btnEditCustomer: any;

	constructor(private translate: TranslateService,
		private customerService : CustomerService,
		private router: Router,
		private _authService: AuthService,
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private addressService: AddressService,
		private toastrService: NbToastrService
	){
		this.entityForm = this.fb.group({
		  email: ['',[Validators.required, Validators.email]],
		  name: ['',[Validators.required, Validators.minLength(5)]],
		  ruc: ['',[Validators.required]],
		  phone: '',
      billingAddress : this.fb.group({
			  addressLine1: ['',[Validators.required]],
        addressLine2: '',
			  zipCode: [''],
			  city: ['',[Validators.required]],
			  country: ['',[Validators.required]],
		  }),
		  shippingAddress : this.fb.group({
			  addressLine1: ['',[Validators.required]],
			  addressLine2: '',
			  zipCode: [''],
			  city: ['',[Validators.required]],
			  country: ['',[Validators.required]],
		  }),
		});
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.addItem').subscribe(res => this.addItem = res);
    this.translate.get('general.updateItem').subscribe(res => this.updateItem = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
    this.translate.get('general.success').subscribe(res => this.success = res);
    this.translate.get('customer.addedCustomer').subscribe(res => this.addedCustomer = res);
    this.translate.get('customer.modifiedCustomer').subscribe(res => this.modifiedCustomer = res);
    this.translate.get('customer.deletedCustomer').subscribe(res => this.deletedCustomer = res);
    this.translate.get('customer.btnNewCustomer').subscribe(res => this.btnNewCustomer = res);
    this.translate.get('customer.btnEditCustomer').subscribe(res => this.btnEditCustomer = res);
	  this.getCustomer();
	}

	customerenjson: {
    "requiredCustomer":"Customer is required",
    "btnaddCustomer":"Add Customer",
    "btnNewCustomer":"New Customer",
    "deletedCustomer": "The client has been deleted",
    "addedCustomer":"The new client has been added",
    "modifiedCustomer":"The client has been modified"
  }

	// save(entityForm) {
	// 	console.log(entityForm);
		
	// 	}

	save(entity: Customer ) {	

		if (this.entityForm.valid){
		  this.loading = true;
		  entity.createdById = this._authService.getCurrentUser().id;
		  entity.billingAddressId = this.customerResponse.billingAddressId ;
		  entity.shippingAddressId = this.customerResponse.shippingAddressId ;
			//actualizar
		  if (this.id != null && this.id !==''){
		      entity.id = +this.id;
          // entity.updateAt = new Date();
		      return this.customerService.update(entity)
		      .subscribe(() => {
						this.showToast('success', this.modifiedCustomer );
						this.router.navigateByUrl('dashboard/customer-list')
					},
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', this.errorMessage)
		      });
		  } else {
			//agregar un registro
        // entity.createdAt = new Date();
		      return this.customerService.create(entity)
		      .subscribe(() => {
						this.showToast('success', this.addedCustomer);
					this.router.navigateByUrl('dashboard/customer-list')
					},
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', this.errorMessage)
		      });
		  }
		}
	}

	getCustomer(){
		if(this.id != null && this.id !== ""){
		this.formTitle = "Update customer";
		  let id : number = +this.id;
		  return this.customerService.getSingle(id).subscribe(
		    result => {
		      this.entityForm.patchValue(result);
		      this.customerResponse = result;
		      console.log( result );
					
		    }, error => {
		      console.log(error);
		    }
		  );
		}
	}

  checkIfSameAddress(checked){
    if (checked){
      this.entityForm.get('shippingAddress.addressLine1').setValue(this.entityForm.get('billingAddress.addressLine1').value);
      this.entityForm.get('shippingAddress.addressLine2').setValue(this.entityForm.get('billingAddress.addressLine2').value);
      this.entityForm.get('shippingAddress.zipCode').setValue(this.entityForm.get('billingAddress.zipCode').value);
      this.entityForm.get('shippingAddress.city').setValue(this.entityForm.get('billingAddress.city').value);
      this.entityForm.get('shippingAddress.country').setValue(this.entityForm.get('billingAddress.country').value);
    }else{
      this.entityForm.get('shippingAddress.addressLine1').setValue(null);
      this.entityForm.get('shippingAddress.addressLine2').setValue(null);
      this.entityForm.get('shippingAddress.zipCode').setValue(null);
      this.entityForm.get('shippingAddress.city').setValue(null);
      this.entityForm.get('shippingAddress.country').setValue(null);
    }
  }

	showToast(status: NbComponentStatus, message: string): void {
		this.toastrService.show(status, message, { status, duration:4000 });
	}

  controlIsRequired(controlName: string, childControl: string, errorName: string) {
    return ((this.entityForm.controls[controlName]) as FormGroup)
					.controls[childControl].hasError(errorName);
  }
  controlIsTouched(controlName: string) {
    return this.entityForm.hasError('required', [controlName]) 
				&& this.entityForm.controls[controlName]?.touched;
  }
  controlIsRequireddir() {
    return this.entityForm.hasError('required', ['addressLine1']) 
				&& this.entityForm.controls.addressLine1?.touched;
  }
	// entityForm.hasError('required', ['ruc']) && entityForm.controls.ruc?.touched
	// controlName: string, childControl: string, errorName: string
}
