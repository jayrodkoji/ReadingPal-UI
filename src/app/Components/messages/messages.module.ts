import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MessagesPageRoutingModule } from './messages-routing.module';

import { MessagesPage } from './messages.page';
import {ReaderPageModule} from "../../reader/reader.module";
import {SharedModuleModule} from "../../shared-module/shared-module.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MessagesPageRoutingModule,
    ReaderPageModule,
    SharedModuleModule
  ],
  declarations: [MessagesPage]
})
export class MessagesPageModule {}
