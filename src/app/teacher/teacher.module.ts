import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TeacherPageRoutingModule } from './teacher-routing.module';
import { TeacherPage } from './teacher.page';
import { SideMenuComponent } from '../Components/side-menu/side-menu.component';
import {SharedModuleModule} from "../shared-module/shared-module.module";
import {LessonOptionsPopComponent} from './lessons/browse-lessons/lesson-options-pop/lesson-options-pop.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeacherPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [
    TeacherPage,
    SideMenuComponent,
    LessonOptionsPopComponent
  ]
})
export class TeacherPageModule {}
