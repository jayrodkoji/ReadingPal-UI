import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LessonOverviewPageRoutingModule } from './lesson-overview-routing.module';
import { LessonOverviewPage } from './lesson-overview.page';
import { StudentQuizCardPage } from './student-quiz-card/student-quiz-card.page';
import { VocabDefinitionComponent } from "../../../shared/popover/vocab/vocab-definition/vocab-definition.component";
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LessonOverviewPageRoutingModule,
    SharedModule
  ],
  exports: [
    StudentQuizCardPage
  ],
  declarations: [
    LessonOverviewPage,
    StudentQuizCardPage,
    VocabDefinitionComponent,
  ]
})
export class LessonOverviewPageModule {}
