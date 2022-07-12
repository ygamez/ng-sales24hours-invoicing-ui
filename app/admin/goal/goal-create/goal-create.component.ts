import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/app/service/auth.service';
import { GoalService } from 'src/app/service/goal.service';
import { Goal } from 'src/app/models/goal';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'goal-create',
	templateUrl: './goal-create.component.html',
	styleUrls: ['./goal-create.component.scss']
})
export class GoalCreateComponent implements OnInit {
	formTitle: string = "Add new goal";
	entityForm: FormGroup;
	loading: boolean = false;
	id: string = this.activatedRoute.snapshot.params["id"];
  errorMessage: string;
  deletedItem: string;

	constructor(private translate: TranslateService,
		private goalService : GoalService,
		private router: Router,
		private _authService: AuthService,
		private fb: FormBuilder,
		private activatedRoute: ActivatedRoute,
		private toastrService: NbToastrService
	){
		this.entityForm = this.fb.group({
		  name: ['',[Validators.required]],
		  amount: ['',[Validators.required]],
		  from: ['',[Validators.required]],
		  to: ['',[Validators.required]],
		});
	}

	ngOnInit(): void {
    this.translate.get('general.occurredError').subscribe(res => this.errorMessage = res);
    this.translate.get('general.deletedItem').subscribe(res => this.deletedItem = res);
	  this.getGoal();
	}

	save(entity: Goal) {
		if (this.entityForm.valid){
		  this.loading = true;
		  this.loading = true;
		  entity.createdById = this._authService.getCurrentUser().id;
		  if (this.id != null && this.id !==''){
		      entity.id = +this.id;
		      return this.goalService.update(entity)
		      .subscribe(() => this.router.navigateByUrl('/dashboard/revenue-list'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', this.errorMessage)
		      });
		  } else {
		      return this.goalService.create(entity)
		      .subscribe(() => this.router.navigateByUrl('/dashboard/revenue-list'),
		      error => {
		          this.loading = false;
		          console.log(error);
		          this.showToast('danger', this.errorMessage)
		      });
		  }
		}
	}

	getGoal(){
		if(this.id != null && this.id !== ""){
		this.formTitle = "Update goal";
		  let id : number = +this.id;
		  return this.goalService.getSingle(id).subscribe(
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
