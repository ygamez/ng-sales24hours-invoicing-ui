import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { InvoiceCustomization } from 'src/app/models/invoice-customization';
import { AuthService } from 'src/app/service/auth.service';
import { InvoiceService } from 'src/app/service/invoice.service';

@Component({
  selector: 'app-invoice-customization',
  templateUrl: './invoice-customization.component.html',
  styleUrls: ['./invoice-customization.component.scss']
})
export class InvoiceCustomizationComponent implements OnInit {
  cardLoading: boolean = false;
	entityForm: FormGroup;
	loading: boolean = false;
	id: number = 0;
  invoiceCustomization: InvoiceCustomization;
  template: string = "standard";
  errorMessage: string;
  saveSetting: string;
  demoMode: string;

  constructor(private authService: AuthService,
    private translate : TranslateService,
    private toastrService: NbToastrService,
    private fb: FormBuilder,
    private invoiceService: InvoiceService) {
      this.entityForm = this.fb.group({
        invoiceTitle: ['', [Validators.required]],
        invoiceSubtitle: '',
        invoiceFooter: '',
        invoiceNotes: '',
        estimateTitle: ['', [Validators.required]],
        estimateSubtitle: '',
        estimateFooter: '',
        estimateNotes: '',
        items: '',
        price: '',
        amount: '',
        hideShippingAddress: true,
        hideDescription: false,
        hideQuantity: false,
        hidePrice: false,
        hideTax: false,
        hideCategory: false,
        hideDiscount: false
      });
    }

  ngOnInit() {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.saveSetting').subscribe(res => this.saveSetting = res);
    this.translate.get('general.demoMode').subscribe(res => this.demoMode = res);
    this.getInvoiceCustomizationInfos();
  }

  save(entity: InvoiceCustomization) {
		if (this.entityForm.valid){
      entity.id = this.id;
		  this.loading = true;
      entity.invoiceName = this.template;
		  entity.createdBy = this.authService.getCurrentUser();
      return this.invoiceService.updateCustomizationInfos(entity)
      .subscribe((result) => {
        this.getInvoiceCustomizationInfos();
        this.showToast("success", this.saveSetting);
        this.loading = false;
      },
      error => {
          this.loading = false;
          console.log(error);
          this.showToast('danger', this.errorMessage);
      });
		}
	}

  getInvoiceCustomizationInfos(){
    var tenantId = this.authService.getCurrentUser().tenantId;
    return this.invoiceService.getCustomizationInfos(tenantId).subscribe(
      result => {
        this.id = result.id;
        this.entityForm.patchValue(result);
        this.template = result.invoiceName;
        this.invoiceCustomization = result;
      }, error => {
        console.log(error);
      }
    );
  }

  selectTemplate(template:string){
    this.template = template;
  }

  showToast(status: NbComponentStatus, message: string): void {
		this.toastrService.show(status, message, { status, duration:4000 });
	}

}
