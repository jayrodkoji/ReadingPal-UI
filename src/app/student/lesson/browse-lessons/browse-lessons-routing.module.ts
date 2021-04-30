import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrowseLessonsPage } from './browse-lessons.page';

const routes: Routes = [
  {
    path: '',
    component: BrowseLessonsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrowseLessonsPageRoutingModule {}
