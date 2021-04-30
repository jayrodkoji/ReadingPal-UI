import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ColorSelectPage } from './color-select.page';

const routes: Routes = [
  {
    path: '',
    component: ColorSelectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ColorSelectPageRoutingModule {}
