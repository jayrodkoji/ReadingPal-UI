import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AwardPage } from './award.page';

const routes: Routes = [
  {
    path: '',
    component: AwardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AwardPageRoutingModule {}
