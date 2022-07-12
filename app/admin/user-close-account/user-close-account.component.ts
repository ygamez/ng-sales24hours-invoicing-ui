import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbComponentStatus, NbDialogService, NbToastrService } from '@nebular/theme';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-close-account',
  templateUrl: './user-close-account.component.html',
  styleUrls: ['./user-close-account.component.scss']
})
export class UserCloseAccountComponent implements OnInit {
  loading = false;
  cardLoading = false;
  form: FormGroup;
  user: User;
  showMessages: any = {};
  strategy: string = '';
  errors: string[] = [];
  errorMessage: string;
  userId: number = this.authService.getCurrentUser().id;

  constructor(private userService: UserService,
    private authService: AuthService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService) {}

  ngOnInit() {}

  closeAccount(){
    this.loading = true;
    return this.userService.delete(this.authService.getCurrentUser().id).subscribe(
      () => {
        this.loading = false;
        this.authService.logout();
      },error => {
        this.loading = false;
        console.log(error);
      }
    );
  }

  open(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog)
    .onClose.subscribe(id => id && this.closeAccount());;
  }

  showToast(status: NbComponentStatus, message: string, duration: number) {
	  this.toastrService.show(status, message, { status, duration:duration });
	}

}
