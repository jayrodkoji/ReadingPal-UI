import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthorizeGuard } from './Providers/guards/authorize-guard.service';


const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'student',
    loadChildren: () => import('./student/student.module').then( m => m.StudentPageModule),
    canActivate: [AuthorizeGuard],
    data: {
      role: 'ROLE_STUDENT'
    }
  },
  {
    path: 'teacher',
    loadChildren: () => import('./teacher/teacher.module').then( m => m.TeacherPageModule),
    canActivate: [AuthorizeGuard],
    data: {
      role: 'ROLE_TEACHER'
    }
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then( m => m.AdminPageModule)
  },
  {
    path: 'quiz',
    loadChildren: () => import('./quiz/quiz.module').then( m => m.QuizPageModule)
  },
  {
    path: 'reader/:bookId',
    loadChildren: () => import('./reader/reader.module').then( m => m.ReaderPageModule)
  },
  {
    path: 'color-select',
    loadChildren: () => import('./shared/popover/color-select/color-select.module').then( m => m.ColorSelectPageModule)
  },
  {
    path: 'image-modal',
    loadChildren: () => import('./modals/image-modal/image-modal.module').then( m => m.ImageModalPageModule)
  },
  {
    path: 'reader-controls',
    loadChildren: () => import('./modals/reader-controls/reader-controls.module').then( m => m.ReaderControlsPageModule)
  },
  {
    path: 'library',
    loadChildren: () => import('./library/library.module').then( m => m.LibraryPageModule)
  },
  {
    path: 'bad-login',
    loadChildren: () => import('./errors/bad-login/bad-login.module').then( m => m.BadLoginPageModule)
  },
  {
    path: 'team',
    loadChildren: () => import('./team/team.module').then( m => m.TeamPageModule)
  },
  {
    path: 'tutorial',
    loadChildren: () => import('./tutorial/tutorial.module').then( m => m.TutorialPageModule)
  }


];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
