import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeacherPage } from './teacher.page';
import { HomeComponent } from './home/home.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'classes',
    pathMatch: 'full',
  },
  {
    path: '',
    component: TeacherPage,
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'classes',
        loadChildren: () => import('./classes/classes.module').then( m => m.ClassesPageModule)
      },
      {
        path: 'lessons',
        loadChildren: () => import('./lessons/lesson.module').then( m => m.LessonPageModule)
      },
      {
        path: 'books',
        loadChildren: () => import('./book/book.module').then( m => m.BookPageModule)

      },
      {
        path: 'awards',
        loadChildren: () => import('./award/award.module').then( m => m.AwardPageModule)
      },
      {
        path: 'messages',
        loadChildren: () => import('../Components/messages/messages.module').then(m => m.MessagesPageModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeacherPageRoutingModule {}
