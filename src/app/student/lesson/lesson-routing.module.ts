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
        path: 'browse-lessons',
        loadChildren: () => import('./browse-lessons/browse-lessons.module').then( m => m.BrowseLessonsPageModule)
      },
      {
        path: 'lesson-overview/:id',
        loadChildren: () => import('./lesson-overview/lesson-overview.module').then( m => m.LessonOverviewPageModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LessonPageRoutingModule {}
