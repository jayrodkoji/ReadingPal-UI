import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GamePageRoutingModule } from './game-routing.module';

import { GamePage } from './game.page';
import {Vocab1Component} from './vocab1/vocab1.component';
import {GameHeartsComponent} from '../Components/game/game-hearts/game-hearts.component';
import {TimesPipe} from '../Pipes/times-pipe';
import {Vocab1OptionsComponent} from './vocab1-options/vocab1-options.component';
import { SharedModuleModule } from '../shared-module/shared-module.module';
import {ExpBarModalComponent} from './exp-bar-modal/exp-bar-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GamePageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModuleModule
  ],
  declarations: [GamePage, Vocab1Component, GameHeartsComponent, TimesPipe, Vocab1OptionsComponent, ExpBarModalComponent]
})
export class GamePageModule {}
