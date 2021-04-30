import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ClassPageRoutingModule } from './classes-routing.module';
import { ClassesPage } from './classes.page';
import { SharedModuleModule} from '../../shared-module/shared-module.module';
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
    SharedModuleModule,
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
