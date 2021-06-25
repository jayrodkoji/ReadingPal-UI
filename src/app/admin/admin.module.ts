import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminPageRoutingModule } from './admin-routing.module';

import { AdminPage } from './admin.page';

import {AddClassModalComponent} from "./add-class-modal/add-class-modal/add-class-modal.component";
import { AddToRosterModalComponent } from './add-to-roster-modal/add-to-roster-modal.component';
import { ClassRosterModalComponent } from './class-roster-modal/class-roster-modal.component';
import { AddUserModalComponent } from './add-user-modal/add-user-modal.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminPageRoutingModule,
    SharedModule
  ],
  declarations: [AdminPage, AddClassModalComponent, AddToRosterModalComponent, ClassRosterModalComponent, AddUserModalComponent]
})
export class AdminPageModule {}
