import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Quiz } from 'src/app/model/Quiz';
import { QuizControllerService } from 'src/app/Providers/quiz-controller/quiz-controller.service';
import {QuestionChoicePost, QuizQuestion, QuizQuestionPost} from 'src/app/Providers/quiz-controller/quiz-data';
import { QuestionComponent } from '../question/question.component';
import {QuizCatalogComponent} from '../quiz-catalog/quiz-catalog.component';

@Component({
  selector: 'app-quiz-card',
  templateUrl: './quiz-card.component.html',
  styleUrls: ['./quiz-card.component.scss'],
})
export class QuizCardComponent implements OnInit {
  @Input() lessonId;
  @Input() quizNum;
  public questionPosts: QuizQuestionPost[];
  questions: QuizQuestion[];

  constructor(
    private modalController: ModalController,
    private quizController: QuizControllerService) { }

  ngOnInit() {
    this.questionPosts = [];
    this.questions = [];

    if (this.lessonId) {
      this.quizController.getQuestionsRequest(this.lessonId)
        .subscribe(result => {
          if (result !== null) {
            this.questionPosts = result.map(
              question => new QuizQuestionPost(
                this.lessonId,
                question.sequence,
                question.text,
                question.choices.map(
                  choice => new QuestionChoicePost(choice.answer, choice.isTrue)
                ))
            );
          }
        });
    }
  }

  createQuestion() {
    this.presentModal();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: QuestionComponent,
      componentProps: {
        lessonId: this.lessonId,
        sequence: 0 // TODO: Implement
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.questionPosts.push(data);
    }
  }

  getAlpha(i){
    return String.fromCharCode(97 + i);
  }

  async importFromCatalog() {
    const modal = await this.modalController.create({
      component: QuizCatalogComponent
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data !== undefined) {
      this.questionPosts = data.map(
        q => new QuizQuestionPost(
          this.lessonId,
          q.sequence,
          q.text,
          q.choices.map(
            c => new QuestionChoicePost(
              c.answer,
              c.isTrue
            )
          )
        )
      );
    }
  }
}
