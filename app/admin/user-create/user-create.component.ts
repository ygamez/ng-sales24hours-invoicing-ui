import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Role } from 'src/app/models/role';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/auth.service';
import { DateService } from 'src/app/service/date.service';
import { RoleService } from 'src/app/service/role.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {
  loading = false;
  cardLoading = false;
  errorMessage: string;
  userId: string;
  updateContactId: number;
  formTitle: string = "Add new user";
  txtBtnSubmit: string = "Save";
  userForm: FormGroup;
  roles: Role[];
  tenantId: number;
  user: User;
  parentRoute: string;
  role: string;
  occurredError: string;
  deletedItem: string;
  userAlreadyExist:string;

  constructor(private _fb: FormBuilder,
    private translate: TranslateService,
    private _userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _roleService: RoleService,
    private _dateService: DateService,
    private _authService: AuthService,
    private toastrService: NbToastrService
  ) {

    // Create form group that the  html form and construct the json entity
    this.userForm = this._fb.group({
      fullname: ['', [Validators.required]],
      email:['', [Validators.required]],
      roleId: ['', [Validators.required]],
    });
    this.userId = this.activatedRoute.snapshot.params["id"];// Get the user id param from url
  }

  ngOnInit() {
    this.translate.get('general.occurredError').subscribe(res => this.occurredError = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
    this.translate.get('general.userAlreadyExist').subscribe(res => this.userAlreadyExist = res);
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentRoute = urlPath[urlPath.length - 1].path;
    })
    this.getRoles();
    if (this.userId != null && this.userId != "") {
      this.formTitle = "Update user";
      this.txtBtnSubmit = "Update";
      this.cardLoading = true;
      this.getUserForUpdate();//Get user information to update and pre-fullfil the form
    }
  }

  upsertUser(user: User) {
    if (this.userForm.valid) {
      this.loading = true;
      user.currentUrl = window.location.origin;
      user.agreeTerm = true;
      if (this.userId != null && this.userId != "") {
        this.user.email = user.email;
        this.user.fullname = user.fullname;
        this.user.roleId = user.roleId;
        this.user.agreeTerm = user.agreeTerm;
        this.user.currentUrl = window.location.origin;
        return this._userService.update(this.user)
        .subscribe(
          result => {
            this.router.navigateByUrl('/dashboard/'+this.parentRoute+"/users")
          },
          error => {
            console.log(error);
            this.errorMessage =  this.occurredError;
            this.loading = false;
          }
        );
      } else {
        user.createdAt = this._dateService.getCurrentDate();
        user.createdById = this._authService.getCurrentUser().id;
        return this._userService.create(user)
        .subscribe(
          result => {
            localStorage.setItem('recovery-email', result.email);
            this.router.navigateByUrl('/dashboard/'+this.parentRoute+"/users")
          },
          error => {
            if (error.status === 409){
              this.showToast("warning", this.userAlreadyExist);
            }else{
              this.showToast("danger", this.errorMessage);
            }
            this.loading = false;
          }
        );
      }
    }
  }

  getUserForUpdate() {
    return this._userService.get(this.userId).subscribe(
      result => {
        this.user = result;
        this.userForm.patchValue(result);
        this.cardLoading = false;
      },
      error => {
        console.log(error);
        this.cardLoading = false;
      }
    );
  }

  getRoles(){
    return this._roleService.getAll().subscribe(
      result => {
        if (this._authService.getCurrentUser().roleId > 1){
          this.roles = result.filter(x => x.id > 1);
        }else{
          this.roles = result;
        }
      }, error => {
        console.error(error);
      }
    )
  }

  showToast(status: NbComponentStatus, message: string) {
	  this.toastrService.show(status, message, { status, duration:4000 });
	}

  selectedRoleChange(roleId){
    this.role = this.roles.find(x => x.id == roleId).name;
  }

}
