import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ClassPageRoutingModule } from './classes-routing.module';
import { ClassesPage } from './classes.page';
import { SharedModule} from '../../shared/shared.module';
import { StudentsComponent } from "./students/students.component";
import { ClassesCardComponent } from "./classes-card/classes-card.component";
import {ReportsComponent} from "./reports/reports.component";
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClassPageRoutingModule,
    SharedModule,
    ChartsModule,
  ],
    exports: [
        ClassesCardComponent

    ],
  declarations: [
    ClassesPage,
    StudentsComponent,
    ClassesCardComponent,
    ReportsComponent
  ]
})
export class ClassesPageModule {}
