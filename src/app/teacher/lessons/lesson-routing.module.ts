import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LessonPage } from './lesson.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'browse-lessons',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LessonPage,
    children: [
      {
        path: 'create-lesson',
        loadChildren: () => import('./create-lesson/create-lesson.module').then( m => m.CreateLessonPageModule),
      },
      {
        path: 'browse-lessons',
        loadChildren: () => import('./browse-lessons/browse-lessons.module').then( m => m.BrowseLessonsPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LessonPageRoutingModule {}
