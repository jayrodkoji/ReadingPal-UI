import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BrowseLessonsPageRoutingModule } from './browse-lessons-routing.module';

import { BrowseLessonsPage } from './browse-lessons.page';
import {SharedModuleModule} from "../../../shared-module/shared-module.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrowseLessonsPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [
    BrowseLessonsPage,
  ]
})
export class BrowseLessonsPageModule {}
