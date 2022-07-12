import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userForm: FormGroup;
  cardLoading: boolean = false;
  errorMessage: string;
  loading: boolean = false;
  user: User;
  passwordDontMatch: string;
  occurredError: string;
  deletedItem: string;
  profileUpdate: string;
  wrongPassword: string;

  constructor(private _fb: FormBuilder,
    private translate: TranslateService,
    private _userService: UserService,
    private toastrService: NbToastrService,
    private authService: AuthService) {
    this.userForm = this._fb.group({
      fullname: ['', [Validators.required]],
      email:['', [Validators.required]],
      password: '',
      newPassword: '',
      confirmNewPassword: ''
    });
  }

  ngOnInit() {
    this.translate.get('general.occurredError').subscribe(res => this.occurredError = res);
    this.translate.get('general.profileUpdate').subscribe(res => this.profileUpdate = res);
    this.translate.get('general.passwordDontMatch').subscribe(res => this.passwordDontMatch = res);
    this.translate.get('general.wrongPassword').subscribe(res => this.wrongPassword = res);
    this.getUserForUpdate();
  }

  getUserForUpdate() {
    this.cardLoading = true;
    return this._userService.get(this.authService.getCurrentUser().id.toString()).subscribe(
      result => {
        this.userForm.patchValue(result);
        this.user = result;
        this.cardLoading = false;
      },
      error => {
        console.log(error);
        this.cardLoading = false;
      }
    );
  }

  upsertUser(user: User) {
    if (this.userForm.valid) {
      this.loading = true;
      user.changePassword = false;
      if (user.newPassword != "" && user.confirmNewPassword != "" ){
        if (user.newPassword == user.confirmNewPassword){
          user.changePassword = true;
        }else{
          this.errorMessage = this.passwordDontMatch;
          this.loading = false;
          return;
        }
      }else{
        user.password = this.user.password;
      }
      user.id = this.authService.getCurrentUser().id;
      return this._userService.updateProfile(user).subscribe(
        (result) => {
          localStorage.setItem("user", JSON.stringify(result));
          this.errorMessage = null;
          this.showToast("success", this.profileUpdate);
          this.getUserForUpdate();
          this.loading = false;
        },
        error => {
          this.errorMessage = this.occurredError;
          if (error.status === 409){
            this.errorMessage = this.wrongPassword;
          }

          this.loading = false;
        }
      );
    }
  }

  showToast(status: NbComponentStatus, message: string): void {
		this.toastrService.show(status, message, { status, duration:4000 });
	}

}
