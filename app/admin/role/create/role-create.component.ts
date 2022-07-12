import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/app/service/auth.service';
import { RoleService } from 'src/app/service/role.service';
import { Role } from 'src/app/models/role';

@Component({
	selector: 'role-create',
	templateUrl: './role-create.component.html',
})
export class RoleCreateComponent implements OnInit {
	formTitle: string = "Add new role";
	entityForm: FormGroup;
	loading: boolean = false;
	id: string = this.activatedRoute.snapshot.params["id"];

	constructor(
		private roleService : RoleService,
		private router: Router,
		private _authService: AuthService,
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private toastrService: NbToastrService
	){
		this.entityForm = this.fb.group({
		  name: ['',[Validators.required]],
		});
	}

	ngOnInit(): void {
	  this.getRole();
	}

	save(entity: Role) {
		if (this.entityForm.valid){
		  this.loading = true;
		  this.loading = true;
		  if (this.id != null && this.id !==''){
		      entity.id = +this.id;
		      return this.roleService.update(entity)
		      .subscribe(() => this.router.navigateByUrl('dashboard/setting-list/role/list'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', 'An error has occurred. Please try again!')
		      });
		  } else {
		      return this.roleService.create(entity)
		      .subscribe(() => this.router.navigateByUrl('dashboard/setting-list/role/list'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', 'An error has occurred. Please verify your informations and try again!')
		      });
		  }
		}
	}

	getRole(){
		if(this.id != null && this.id !== ""){
		this.formTitle = "Update role";
		  let id : number = +this.id;
		  return this.roleService.getSingle(id).subscribe(
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
