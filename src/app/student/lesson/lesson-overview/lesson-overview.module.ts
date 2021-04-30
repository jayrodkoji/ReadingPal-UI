import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LessonOverviewPageRoutingModule } from './lesson-overview-routing.module';
import { LessonOverviewPage } from './lesson-overview.page';
import { StudentAvatarsComponent } from '../../../Components/student-avatars/student-avatars.component';
import { BadgeRowComponent } from '../../../Components/badge-row/badge-row.component';
import { StudentQuizCardPage } from './student-quiz-card/student-quiz-card.page';
import { VocabDefinitionComponent } from "../../../Components/popover/vocab/vocab-definition/vocab-definition.component";
import { SharedModuleModule } from "../../../shared-module/shared-module.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LessonOverviewPageRoutingModule,
    SharedModuleModule
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
