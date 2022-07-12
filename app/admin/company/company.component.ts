import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Address } from 'src/app/models/address';
import { Company } from 'src/app/models/company';
import { AddressService } from 'src/app/service/address.service';
import { AuthService } from 'src/app/service/auth.service';
import { CompanyService } from 'src/app/service/company.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  cardLoading: boolean = false;
	entityForm: FormGroup;
	loading: boolean = false;
	id: number = 0;
  companyInfoUpdate: string;
  errorMessage: string;

	constructor(private translate: TranslateService,
		private companyService : CompanyService,
		private _authService: AuthService,
		private fb: FormBuilder,
		private toastrService: NbToastrService
	){
		this.entityForm = this.fb.group({
		  email: ['',[Validators.required]],
		  name: ['',[Validators.required]],
		  phone: '',
      registrationNumber: '',
      taxNumber: '',
      taxNumberType: '',
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
    this.translate.get('general.companyInfoUpdate').subscribe(res => { this.companyInfoUpdate = res });
	  this.getCompany();
	}

	save(entity: Company) {
		if (this.entityForm.valid){
      entity.id = this.id;
		  this.loading = true;
		  entity.createdBy = this._authService.getCurrentUser();
      return this.companyService.update(entity)
      .subscribe((result) => {
        this.getCompany();
        this.showToast("success",this.companyInfoUpdate);
        this.loading = false;
      },
      error => {
          this.loading = false;
          console.log(error);
          this.showToast('danger', this.errorMessage)
      });
		}
	}

	getCompany(){
    this.cardLoading = true;
    var tenantId = this._authService.getCurrentUser().tenantId;
    return this.companyService.getByTenant(tenantId).subscribe(
      result => {
        if (result){
          this.id = result.id;
          this.entityForm.patchValue(result);
        }
        this.cardLoading = false;
      }, error => {
        console.log(error);
        this.cardLoading = false;
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
    return ((this.entityForm.controls[controlName]) as FormGroup).controls[childControl].hasError(errorName);
  }
}
