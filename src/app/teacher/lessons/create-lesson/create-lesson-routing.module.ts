import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateLessonPage } from './create-lesson.page';

const routes: Routes = [
  {
    path: '',
    component: CreateLessonPage
  },
  {
    path: 'chapter-select-popover',
    loadChildren: () => import('./add-reading/chapter-select-popover/chapter-select-popover.module').then( m => m.ChapterSelectPopoverPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateLessonPageRoutingModule {}
