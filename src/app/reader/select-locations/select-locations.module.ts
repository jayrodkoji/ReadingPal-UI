import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectLocationsPageRoutingModule } from './select-locations-routing.module';

import { SelectLocationsPage } from './select-locations.page';
import { TableOfContentsComponent } from '../table-of-contents/table-of-contents.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectLocationsPageRoutingModule,
  ],
  declarations: [
    SelectLocationsPage,
  ]
})
export class SelectLocationsPageModule {}
