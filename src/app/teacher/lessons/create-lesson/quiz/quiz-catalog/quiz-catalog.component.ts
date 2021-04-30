import { Component, OnInit } from '@angular/core';
import {LessonService} from '../../../../../Providers/lesson-services/lesson.service';
import {QuizControllerService} from '../../../../../Providers/quiz-controller/quiz-controller.service';
import {forkJoin} from 'rxjs';
import {ModalController} from '@ionic/angular';
import {QuestionChoicePost, QuizQuestionPost} from '../../../../../Providers/quiz-controller/quiz-data';

@Component({
  selector: 'app-quiz-catalog',
  templateUrl: './quiz-catalog.component.html',
  styleUrls: ['./quiz-catalog.component.scss'],
})
export class QuizCatalogComponent implements OnInit {
  lessons: any[];
  quizzes: any[];
  viewing: number;

  constructor(
    private modalController: ModalController,
    private lessonController: LessonService,
    private quizController: QuizControllerService
  ) { }

  ngOnInit() {
    this.lessonController.getLessons()
      .subscribe(lessons => {
        if (lessons) {
          forkJoin(lessons.map(
            lesson => this.quizController.getQuestionsRequest(lesson.id.toString())
          )).subscribe(quizzes => {
            this.lessons = lessons.filter((l, i) => quizzes[i].length > 0)
                .sort((a, b) => a.title.localeCompare(b.title));
            this.quizzes = quizzes.filter(q => q.length > 0);
          });
        }
      });
  }

  view(i) {
    this.viewing = i;
  }

  back() {
    this.viewing = undefined;
  }

  select() {
    console.log(this.quizzes[this.viewing]);

    this.modalController.dismiss(
      this.quizzes[this.viewing].map(
        q => new QuizQuestionPost(
          q.lessonId,
          q.sequence,
          q.text,
          q.choices.map(
            c => new QuestionChoicePost(
              c.answer,
              c.correct
            )
          )
        )
      )
    );
  }

  getLetter(num: number) {
    return String.fromCharCode(96 + num);
  }
}
