import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/app/service/auth.service';
import { CurrencyService } from 'src/app/service/currency.service';
import { Currency } from 'src/app/models/currency';
import { SettingService } from 'src/app/service/setting.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'currency-create',
	templateUrl: './currency-create.component.html',
	styleUrls: ['./currency-create.component.scss']
})
export class CurrencyCreateComponent implements OnInit {
	formTitle: string = "Add new currency";
	entityForm: FormGroup;
	loading: boolean = false;
	id: string = this.activatedRoute.snapshot.params["id"];
  parentRoute: string;
  cardloading = false;
  codes: string[];
  filteredCountries: any;
  public errorMessage: string;
  public deletedItem: string;

	constructor(private settingService: SettingService,
    private translate: TranslateService,
		private currencyService : CurrencyService,
		private router: Router,
		private _authService: AuthService,
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private toastrService: NbToastrService
	){
		this.entityForm = this.fb.group({
		  name: ['',[Validators.required]],
		  symbol: ['',[Validators.required]],
		  isoCode: ['USD',[Validators.required]],
		  default: false,
		});
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
	  this.getCurrency();
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentRoute = urlPath[urlPath.length - 1].path;
    });
    this.getCountriesAndCurrencies();
	}

	save(entity: Currency) {
		if (this.entityForm.valid){
		  this.loading = true;
		  this.loading = true;
		  entity.createdById = this._authService.getCurrentUser().id;
      entity.userRole = this.parentRoute;
		  if (this.id != null && this.id !==''){
		      entity.id = +this.id;
		      return this.currencyService.update(entity)
		      .subscribe(() => this.router.navigateByUrl('/dashboard/'+this.parentRoute+'/currencies'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', this.errorMessage)
		      });
		  } else {
		      return this.currencyService.create(entity)
		      .subscribe(() => this.router.navigateByUrl('/dashboard/'+this.parentRoute+'/currencies'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', this.errorMessage)
		      });
		  }
		}
	}

	getCurrency(){
		if(this.id != null && this.id !== ""){
		this.formTitle = "Update currency";
		  let id : number = +this.id;
		  return this.currencyService.getSingle(id).subscribe(
		    result => {
		      this.entityForm.patchValue(result);
		    }, error => {
		      console.log(error);
		    }
		  );
		}
	}

	showToast(status: NbComponentStatus, message: string): void {
		this.toastrService.show(status, message, { status, duration:4000 });
	}

  getCountriesAndCurrencies(){
    this.cardloading = true;
    return this.settingService.getCountriesAndCurrencies().subscribe(
      result => {
        if (result !=null){
          this.cardloading = false;
          this.codes = [];
          result.forEach(element => {
            if (!this.codes.includes(element.currencies[0])){
              this.codes.push(element.currencies[0])
            }
          });
        }
      },error =>{
        this.cardloading = false;
        console.log(error);
      }
    );
  }

  onCurrencyChange(currencyName){
    this.entityForm.get('name').setValue(currencyName);
  }
}
