import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AwardPageRoutingModule } from './award-routing.module';

import { AwardPage } from './award.page';
import {BadgeCreatorComponent} from '../../shared/badge-creator/badge-creator.component';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AwardPageRoutingModule,
    SharedModule
  ],
  declarations: [
    AwardPage,
    BadgeCreatorComponent,
  ]
})
export class AwardPageModule {}
