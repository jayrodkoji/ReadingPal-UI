import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateLessonPageRoutingModule } from './create-lesson-routing.module';

import { CreateLessonPage } from './create-lesson.page';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { AddReadingComponent } from './add-reading/add-reading.component';
import { VocabularyComponent } from './vocabulary/vocabulary.component';
import { QuizComponent } from './quiz/quiz.component';
import { AwardComponent } from './award/award.component';
import { QuestionComponent } from './quiz/question/question.component';
import { QuizCardComponent } from './quiz/quiz-card/quiz-card.component';
import { SelectLocationsPage } from 'src/app/reader/select-locations/select-locations.page';
import {ClassesPageModule} from '../../classes/classes.module';
import {LessonOverviewPageModule} from '../../../student/lesson/lesson-overview/lesson-overview.module';
import {SharedModuleModule} from "../../../shared-module/shared-module.module";
import {StudentPickerComponent} from './student-picker/student-picker.component';
import {GroupPickerComponent} from './group-picker/group-picker.component';
import {StudentAssignerComponent} from './basic-info/student-assigner/student-assigner.component';
import {DpDatePickerModule} from 'ng2-date-picker';
import {QuizCatalogComponent} from './quiz/quiz-catalog/quiz-catalog.component';
import {VocabCatalogComponent} from './vocabulary/vocab-catalog/vocab-catalog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateLessonPageRoutingModule,
    ReactiveFormsModule,
    ClassesPageModule,
    LessonOverviewPageModule,
    SharedModuleModule,
    DpDatePickerModule
  ],
  declarations: [
    CreateLessonPage,
    BasicInfoComponent,
    AddReadingComponent,
    VocabularyComponent,
    QuizComponent,
    QuestionComponent,
    QuizCardComponent,
    SelectLocationsPage,
    StudentPickerComponent,
    GroupPickerComponent,
    StudentAssignerComponent,
    QuizCatalogComponent,
    VocabCatalogComponent
  ],
  providers: [
    DatePipe
  ]
})
export class CreateLessonPageModule {}
