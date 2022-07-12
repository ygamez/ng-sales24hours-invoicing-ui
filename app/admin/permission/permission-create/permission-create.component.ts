import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/app/service/auth.service';
import { PermissionService } from 'src/app/service/permission.service';
import { Permission } from 'src/app/models/permission';

@Component({
	selector: 'permission-create',
	templateUrl: './permission-create.component.html',
	styleUrls: ['./permission-create.component.scss']
})
export class PermissionCreateComponent implements OnInit {
	formTitle: string = "Add new permission";
	entityForm: FormGroup;
	loading: boolean = false;
	id: string = this.activatedRoute.snapshot.params["id"];

	constructor(
		private permissionService : PermissionService,
		private router: Router,
		private _authService: AuthService,
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private toastrService: NbToastrService
	){
		this.entityForm = this.fb.group({
		  name: ['',[Validators.required]],
		  route: ['',[Validators.required]],
		});
	}

	ngOnInit(): void {
	  this.getPermission();
	}

	save(entity: Permission) {
		if (this.entityForm.valid){
		  this.loading = true;
		  this.loading = true;
		  if (this.id != null && this.id !==''){
		      entity.id = +this.id;
		      return this.permissionService.update(entity)
		      .subscribe(() => this.router.navigateByUrl('dashboard/setting-list/permission/list'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', 'An error has occurred. Please try again!')
		      });
		  } else {
		      return this.permissionService.create(entity)
		      .subscribe(() => this.router.navigateByUrl('dashboard/setting-list/permission/list'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', 'An error has occurred. Please verify your informations and try again!')
		      });
		  }
		}
	}

	getPermission(){
		if(this.id != null && this.id !== ""){
		this.formTitle = "Update permission";
		  let id : number = +this.id;
		  return this.permissionService.getSingle(id).subscribe(
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
}
