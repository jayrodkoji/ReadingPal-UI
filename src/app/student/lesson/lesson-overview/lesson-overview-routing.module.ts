import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LessonOverviewPage } from './lesson-overview.page';

const routes: Routes = [
  {
    path: '',
    component: LessonOverviewPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LessonOverviewPageRoutingModule {}
