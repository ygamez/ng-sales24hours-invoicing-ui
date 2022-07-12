import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/app/service/auth.service';
import { VendorService } from 'src/app/service/vendor.service';
import { Vendor } from 'src/app/models/vendor';
import { AddressService } from 'src/app/service/address.service';
import { Address } from 'src/app/models/address';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'vendor-create',
	templateUrl: './vendor-create.component.html',
	styleUrls: ['./vendor-create.component.scss']
})
export class VendorCreateComponent implements OnInit {
	formTitle: string = "Agregar nuevo proveedor";
	entityForm: FormGroup;
	loading: boolean = false;
	id: string = this.activatedRoute.snapshot.params["id"];
	public addresss: Address[] = [];
  createdAt: string;
  errorMessage: string;
  deletedItem: string;


	constructor(private translate: TranslateService,
		private vendorService : VendorService,
		private router: Router,
		private _authService: AuthService,
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private addressService: AddressService,
		private toastrService: NbToastrService
	){
		this.entityForm = this.fb.group({
		  email: ['',[Validators.required]],
		  name: ['',[Validators.required]],
		  phone: '',
		  billingAddress : this.fb.group({
			  addressLine1: ['',[Validators.required]],
        addressLine2: '',
			  zipCode: ['',[Validators.required]],
			  city: ['',[Validators.required]],
			  country: ['',[Validators.required]],
		  }),
		  shippingAddress : this.fb.group({
			  addressLine1: ['',[Validators.required]],
			  addressLine2: '',
			  zipCode: ['',[Validators.required]],
			  city: ['',[Validators.required]],
			  country: ['',[Validators.required]],
		  }),
		});
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
	  this.getVendor();
	}

	save(entity: Vendor) {
		if (this.entityForm.valid){
		  this.loading = true;
		  entity.createdById = this._authService.getCurrentUser().id;
		  if (this.id != null && this.id !==''){
		      entity.id = +this.id;
          entity.createdAt = this.createdAt;
		      return this.vendorService.update(entity)
		      .subscribe(() => this.router.navigateByUrl('dashboard/vendor-list'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', this.errorMessage)
		      });
		  } else {
		      return this.vendorService.create(entity)
		      .subscribe(() => this.router.navigateByUrl('dashboard/vendor-list'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', this.errorMessage)
		      });
		  }
		}
	}

	getVendor(){
		if(this.id != null && this.id !== ""){
		this.formTitle = "Update vendor";
		  let id : number = +this.id;
		  return this.vendorService.getSingle(id).subscribe(
		    result => {
          this.createdAt = result.createdAt;
		      this.entityForm.patchValue(result);
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
    return ((this.entityForm.controls[controlName]) as FormGroup).controls[childControl].hasError(errorName);
  }
}
