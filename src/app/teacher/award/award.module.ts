import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AwardPageRoutingModule } from './award-routing.module';

import { AwardPage } from './award.page';
import {BadgeCreatorComponent} from '../../Components/badge-creator/badge-creator.component';
import {SharedModuleModule} from "../../shared-module/shared-module.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AwardPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [
    AwardPage,
    BadgeCreatorComponent,
  ]
})
export class AwardPageModule {}
