import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundPage } from '../errors/page-not-found/page-not-found.page';

import { StudentPage } from './student.page';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: StudentPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../student/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'lessons',
        loadChildren: () => import('./lesson/lesson.module').then( m => m.LessonPageModule)
      },
      {
        path: 'library',
        loadChildren: () => import('../library/library.module').then(m => m.LibraryPageModule)
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then( m => m.ReportsPageModule)
      },
      {
        path: 'messages',
        loadChildren: () => import('../shared/messages/messages.module').then(m => m.MessagesPageModule)
      },
      {
        path: 'badges',
        loadChildren: () => import('./badges/badges.module').then( m => m.BadgesPageModule)
      },
    ]
  },
  {
    path: '**',
    component: PageNotFoundPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentPageRoutingModule {}
