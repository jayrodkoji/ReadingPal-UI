import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StudentQuizCardPageRoutingModule } from './student-quiz-card-routing.module';

import { StudentQuizCardPage } from './student-quiz-card.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudentQuizCardPageRoutingModule
  ],
  declarations: [StudentQuizCardPage]
})
export class StudentQuizCardPageModule {}
