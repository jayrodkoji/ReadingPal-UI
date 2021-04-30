import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LessonPageRoutingModule } from './lesson-routing.module';
import { LessonPage } from './lesson.page';
import {SharedModuleModule} from "../../shared-module/shared-module.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LessonPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [LessonPage]
})
export class LessonPageModule {}
