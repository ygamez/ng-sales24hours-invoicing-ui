import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { IndexComponent } from './index/index.component';
import { NbButtonModule, NbCardModule, NbFormFieldModule, NbIconModule, NbLayoutModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    IndexComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NbButtonModule,
    NbLayoutModule,
    NbIconModule,
    NbEvaIconsModule,
    NbSpinnerModule,
    TranslateModule,
    NbFormFieldModule,
    NbSelectModule,
    NbCardModule
  ],
  providers: [
  ]
})
export class HomeModule { }
