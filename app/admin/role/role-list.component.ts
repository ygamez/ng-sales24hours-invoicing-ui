import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService, NbComponentStatus, NbDialogService } from '@nebular/theme';
import { RoleService } from 'src/app/service/role.service';
import { Role } from 'src/app/models/role';
import { TableService } from 'src/app/service/table.service';
import { AttributeType } from 'src/app/models/attributeType';
import { NgbdSortableHeader, SortEvent } from 'src/app/directive/sortable.directive';
import { Observable } from 'rxjs';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { PermissionService } from 'src/app/service/permission.service';
import { Permission } from 'src/app/models/permission';

@Component({
	selector: 'role-list',
	templateUrl: './role-list.component.html',
})
export class RoleListComponent implements OnInit {
	public roles: Role[];
	public message: string;
	public loading: boolean = false;
	public total$: Observable<number>;
	@ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  public permissions: Permission[];

	constructor(private roleService : RoleService,
    private _dialogService: NbDialogService,
    private permissionService: PermissionService,
    private toastrService: NbToastrService, public _tableService: TableService, private router: Router) {
		this.total$ = _tableService.total$;
		this.searchableColumn();
	}

	ngOnInit(): void {
		this.getList();
    this.getPermissions();
	}

	getList() {
		this.loading = true;
		return this.roleService.getAll().subscribe( result => {
		  this.roles = result;
		  this.loading = false;
		}, (error) => {
		  console.log(error); this.loading = false;
		});
	}

  getPermissions() {
		this.loading = true;
		return this.permissionService.getAll().subscribe( result => {
		  this.permissions = result;
		  if (result.length == 0) this.message = "There is no data at this time...";
		  this.loading = false;
		}, (error) => {
		  console.log(error); this.loading = false;
		});
	}

	delete(id: number){
		return this.roleService.delete(id).subscribe(result => {
		  this.showToast('success',"The item are succefully deleted!");
		  this.getList();
		}, error => {
		  this.showToast('danger',"An error occur. Please try again...");
		  console.log(error);
		});
	}

	onSort({column, direction}: SortEvent) {
		this.headers.forEach(header => {
		  if (header.sortable !== column) {
		    header.direction = '';
		  }
		});
		this._tableService.sortColumn = column;
		this._tableService.sortDirection = direction;
	}

	searchableColumn(){
		let attributeTypes: AttributeType[] = [
		  { id: null, name: 'name', type: 'string'},
		];
		this._tableService.setAttributesType(attributeTypes);
	}

	showToast(status: NbComponentStatus, message: string) {
	  this.toastrService.show(status, message, { status, duration:4000 });
	}

  deleteConfirmation(id: number) {
    this._dialogService.open(DeleteConfirmationComponent, { closeOnBackdropClick: false })
      .onClose.subscribe(result => {
        if(result === true){
          this.delete(id);
        }
    });
  }

  selectedRole(role: Role){

  }
}
