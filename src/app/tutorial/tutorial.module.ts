import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TutorialPageRoutingModule } from './tutorial-routing.module';

import { TutorialPage } from './tutorial.page';
import {SharedModuleModule} from "../shared-module/shared-module.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TutorialPageRoutingModule,
        SharedModuleModule
    ],
  declarations: [TutorialPage]
})
export class TutorialPageModule {}
