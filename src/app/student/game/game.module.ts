import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GamePageRoutingModule } from './game-routing.module';

import { GamePage } from './game.page';
import {SharedModuleModule} from "../../shared-module/shared-module.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        GamePageRoutingModule,
        SharedModuleModule
    ],
  declarations: [GamePage]
})
export class GamePageModule {}
