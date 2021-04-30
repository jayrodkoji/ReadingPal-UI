import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectLocationsPage } from './select-locations.page';

const routes: Routes = [
  {
    path: '',
    component: SelectLocationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectLocationsPageRoutingModule {}
