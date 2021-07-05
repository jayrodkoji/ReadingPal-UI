import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeamPageRoutingModule } from './team-routing.module';

import { TeamPage } from './team.page';
import {TeamCardComponent} from './team-card/team-card.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeamPageRoutingModule,
    SharedModule
  ],
  declarations: [TeamPage, TeamCardComponent]
})
export class TeamPageModule {}
