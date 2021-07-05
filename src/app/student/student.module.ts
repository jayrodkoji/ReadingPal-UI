import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { StudentPageRoutingModule } from './student-routing.module';
import { StudentPage } from './student.page';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudentPageRoutingModule,
    SharedModule,
  ],
  declarations: [
    StudentPage,
  ],
  exports: [
  ]
})
export class StudentPageModule {}
