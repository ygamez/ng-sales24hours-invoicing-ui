import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { RoleEnum } from 'src/app/models/role-enum';
import { AuthService } from 'src/app/service/auth.service';
import { SIDEBAR_MENUS } from 'src/assets/translate/sidebar-menu';
import { SUPER_ADMIN_MENUS } from 'src/assets/translate/super-admin-menu';
import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  lang: string = localStorage.getItem('lang') != null ? localStorage.getItem('lang') : 'en';
  superAdminMenu = [];
  menuItems = [];
  sidebarMenus = SIDEBAR_MENUS[this.lang];
  superAdminMenus = SUPER_ADMIN_MENUS[this.lang];

  constructor(private authService: AuthService, private translateService: TranslateService) {
    if (this.userIsSuperAdmin()){
      this.superAdminMenu = this.superAdminMenus;
    }
    this.menuItems = this.sidebarMenus.concat(this.superAdminMenu);
  }

  ngOnInit(): void {
  }

  userIsSuperAdmin(): boolean{
    if(this.authService.getCurrentUser() != null){
      return this.authService.getCurrentUser().role.name == RoleEnum.SuperAdmin;
    }
    return false;
  }

}
