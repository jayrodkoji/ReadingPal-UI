import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BadLoginPageRoutingModule } from './bad-login-routing.module';

import { BadLoginPage } from './bad-login.page';
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BadLoginPageRoutingModule,
    SharedModule
  ],
  declarations: [BadLoginPage]
})
export class BadLoginPageModule { }
