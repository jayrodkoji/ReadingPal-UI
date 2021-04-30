import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { QuizCardComponent } from './quiz-card/quiz-card.component';
import { Quiz } from 'src/app/model/Quiz';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  @Input() lessonId: number;
  quiz: Quiz;
  quizzes: Quiz[] = [];

  @ViewChild(QuizCardComponent)
  public quizCardComponent: QuizCardComponent;

  @Input()
  set initialQuizzes(quizzes: Quiz[]) {
    if (quizzes) {
      this.quizzes = quizzes;
    }
  }

  constructor() { }

  ngOnInit() {
    if (this.quizzes.length === 0) {
      this.createQuiz();
    }
  }

  getQuizzes() {
    if (this.lessonId) {
      return this.quizzes;
    }
  }

  createQuiz(){
    const newQuiz = {
      id: this.lessonId,
      title: '',
      type: '',
      score: 0,
      questions: []
    };

    this.quizzes.push(newQuiz);
  }
}
