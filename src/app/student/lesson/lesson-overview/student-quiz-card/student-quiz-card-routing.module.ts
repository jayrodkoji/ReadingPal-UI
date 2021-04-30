import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudentQuizCardPage } from './student-quiz-card.page';

const routes: Routes = [
  {
    path: '',
    component: StudentQuizCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentQuizCardPageRoutingModule {}
