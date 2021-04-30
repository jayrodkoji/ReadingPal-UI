import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReaderPage } from './reader.page';

const routes: Routes = [
  {
    path: '',
    component: ReaderPage
  },  {
    path: 'select-locations',
    loadChildren: () => import('./select-locations/select-locations.module').then( m => m.SelectLocationsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReaderPageRoutingModule {}
