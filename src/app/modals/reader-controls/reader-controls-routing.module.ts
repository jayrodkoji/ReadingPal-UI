import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReaderControlsPage } from './reader-controls.page';

const routes: Routes = [
  {
    path: '',
    component: ReaderControlsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReaderControlsPageRoutingModule {}
