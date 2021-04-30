import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
        path: 'lesson',
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
        loadChildren: () => import('../Components/messages/messages.module').then(m => m.MessagesPageModule)
      },
      {
        path: 'badges',
        loadChildren: () => import('./badges/badges.module').then( m => m.BadgesPageModule)
      },
      {
        path: 'game',
        loadChildren: () => import('./game/game.module').then(m => m.GamePageModule)
      }
    ]
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'lesson',
    loadChildren: () => import('./lesson/lesson.module').then( m => m.LessonPageModule)
  },
  {
    path: 'classes',
    loadChildren: () => import('./classes/classes.module').then( m => m.ClassesPageModule)
  },
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.module').then( m => m.ReportsPageModule)
  },
  {
    path: 'game',
    loadChildren: () => import('./game/game.module').then( m => m.GamePageModule)
  }





];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentPageRoutingModule {}
