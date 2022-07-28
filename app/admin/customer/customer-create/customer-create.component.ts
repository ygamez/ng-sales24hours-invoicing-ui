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
// import { emailPattern, rucPattern } from 'src/app/utils/validators/validaciones';
import { Stripe } from '../../../models/application-setting';
import { EmailValidatorService } from '../../../utils/validator/email-validator.service';
import { emailPattern } from 'src/app/utils/validator/validaciones';

@Component({
	selector: 'customer-create',
	templateUrl: './customer-create.component.html',
	styleUrls: ['./customer-create.component.scss']
})
export class CustomerCreateComponent implements OnInit {
	
	formTitle: string = "Add new customer";
	// entityForm: FormGroup;
	loading: boolean = false;
	id: string = this.activatedRoute.snapshot.params["id"];
	public addresss: Address[] = [];
	public customers: Customer[] = [];
	showMessages: any = {};
	errors: string[] = [];
  public errorMessage: string;
  public deletedItem: string;
	public addItem: string;
	public updateItem: string;
	public addedCustomer: string;
	public modifiedCustomer: string;
	public deletedCustomer: string;
	public existCustomerRuc: string;
	public existCustomerEmail: string;
	public success: string;
	public btnNewCustomer: string;
	public btnEditCustomer: string;
	userAlreadyExist: string;
  getcustoerResponse : Customer;	
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
	entityForm : FormGroup = this.fb.group({
		email: ['', [Validators.required, Validators.pattern( emailPattern )  ], /*[this.ev]*/],
		name: ['', [Validators.required, ]],
		ruc: ['', [Validators.required, Validators.min(0) ,Validators.minLength(9), Validators.maxLength(12) ]],
		phone: '',
		billingAddress : this.fb.group({
			addressLine1: ['',[Validators.required]],
			addressLine2: '',
			zipCode: [''],
			country: ['Ecuador',[Validators.required]],
			city: ['',[Validators.required]],
		}),
		shippingAddress : this.fb.group({
			addressLine1: ['',[Validators.required]],
			addressLine2: '',
			zipCode: [''],
			country: ['Ecuador',[Validators.required]],
			city: ['',[Validators.required]],
		}),
	});

	constructor(private translate: TranslateService,
		private customerService : CustomerService,
		private router: Router,
		private _authService: AuthService,
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private addressService: AddressService,
		private toastrService: NbToastrService,
		private ev: EmailValidatorService
	){
		
	}

	ngOnInit(): void {

		// this.entityForm.controls.billingAddress.reset({
		// 	country: 'Ecuador',
		// })
		// this.entityForm.controls.shippingAddress.reset({
		// 	country: 'Ecuador',
		// })

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
		this.translate.get('customer.existCustomerRuc').subscribe(res => this.existCustomerRuc = res);
    this.translate.get('customer.existCustomerEmail').subscribe(res => this.existCustomerEmail = res);
	  this.getCustomer();
		this.getCustomerAll();

	}

	save(entity: Customer ) {	

		if (this.entityForm.valid){
		  this.loading = true;
		  entity.createdById = this._authService.getCurrentUser().id;
		  entity.billingAddressId = this.customerResponse.billingAddressId ;
		  entity.shippingAddressId = this.customerResponse.shippingAddressId ;
			var existRuc = this.customers.find( r => r.ruc == entity.ruc )
			var existemail = this.customers.find( r => r.email == entity.email )

			if( existRuc!= null){
				this.loading = false;
				this.showToast('danger', this.existCustomerRuc );
				
			}else if( existemail!= null){
				this.loading = false;
				this.showToast('danger', this.existCustomerEmail );				
			}			
			else{
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
					},err => {
						this.loading = false;
						console.log(err);
						this.showMessages.error = true;
						if ( err === 409 ){
							this.errors.push(this.userAlreadyExist);
						}else{
							this.errors.push(this.errorMessage);
						}
					}
					);
				}
			}
		}
	}

	getCustomer( ){
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

	getCustomerAll( ){
		return this.customerService.getAll()
					 .subscribe( resul => {
								this.customers = resul
					 }, error => {
						console.log( error );
						}
					 );
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
  controlIsTouched( controlFormName : string, controlName: string) {
    return this[controlFormName].hasError('required', [controlName]) 
				&& this[controlFormName].controls[controlName]?.touched;
  }
  controlGroupIsTouched( controlFormName : string, controlGroupName :string, controlName: string) {
    return this[controlFormName].controls[controlGroupName].hasError('required', [controlName]) 
				&& this[controlFormName].controls[controlGroupName].get(controlName).touched;
  }

	rucNoNegativo( ): boolean{
		this.entityForm.controls.ruc.setErrors ( null );
		return  this.entityForm.controls.ruc.value < 0;
	}
}
