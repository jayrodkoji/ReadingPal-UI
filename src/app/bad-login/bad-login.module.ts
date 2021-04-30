import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BadLoginPageRoutingModule } from './bad-login-routing.module';

import { BadLoginPage } from './bad-login.page';
import {SharedModuleModule} from "../shared-module/shared-module.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        BadLoginPageRoutingModule,
        SharedModuleModule
    ],
  declarations: [BadLoginPage]
})
export class BadLoginPageModule {}
