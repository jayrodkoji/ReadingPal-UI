import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BadgesPageRoutingModule } from './badges-routing.module';

import { BadgesPage } from './badges.page';
import {SharedModuleModule} from '../../shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BadgesPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [BadgesPage]
})
export class BadgesPageModule {}
