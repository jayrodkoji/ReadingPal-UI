import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StudentPageRoutingModule } from './student-routing.module';
import { StudentPage } from './student.page';
import {SharedModuleModule} from "../shared-module/shared-module.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudentPageRoutingModule,
    SharedModuleModule,
  ],
  declarations: [
    StudentPage,
  ],
  exports: [
  ]
})
export class StudentPageModule {}
