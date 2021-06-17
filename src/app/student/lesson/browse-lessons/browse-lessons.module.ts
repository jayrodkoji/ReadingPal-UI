import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BrowseLessonsPageRoutingModule } from './browse-lessons-routing.module';

import { BrowseLessonsPage } from './browse-lessons.page';
import {SharedModule} from "../../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrowseLessonsPageRoutingModule,
    SharedModule
  ],
  declarations: [BrowseLessonsPage]
})
export class BrowseLessonsPageModule {}
