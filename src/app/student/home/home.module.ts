import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
import {SharedModuleModule} from '../../shared-module/shared-module.module';
import {AssignmentListViewComponent} from './assignment-list-view/assignment-list-view.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedModuleModule
  ],
  declarations: [
    HomePage,
    AssignmentListViewComponent
  ]
})
export class HomePageModule {}
