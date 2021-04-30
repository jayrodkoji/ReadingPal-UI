import {Component, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import { QuizQuestion} from '../Providers/quiz-controller/quiz-data';
import {CompletedLessonService} from '../Providers/completed-lesson/completed-lesson.service';
import {
  CompletedChoiceData,
  CompletedLessonData, CompletedLessonResult,
  CompletedQuestionData
} from '../Providers/completed-lesson/Model/completed-lesson-data';
import {ModalController, NavController} from '@ionic/angular';
import {QuizControllerService} from '../Providers/quiz-controller/quiz-controller.service';
import {Observable, Subject} from 'rxjs';
import {QuizQuestionComponent} from './quiz-question/quiz-question.component';
import {BadgeControllerService} from '../Providers/badges/badge-controller.service';
import {LessonControllerService} from '../Providers/teacher/lesson-controller.service';
import {LessonData} from '../Providers/lesson-services/lesson-services-models/lesson-data';
import {AwardReceivedComponent} from '../Components/award-received/award-received.component';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
})
export class QuizPage implements OnInit {
  @ViewChild(QuizQuestionComponent) quizQuestionView!: QuizQuestionComponent;
  @ViewChildren(QuizQuestionComponent) quizQuestionViews!: QueryList<QuizQuestionComponent>;

  quiz: QuizQuestion[];
  lessonId: number;
  isStarted = false;
  isFinished = false;
  currentQuestionIndex: number;
  studentAnswers = [];
  isGraded = false;
  quizResult: CompletedLessonResult;
  initComplete = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private completedLessonService: CompletedLessonService,
    private navCtrl: NavController,
    private quizController: QuizControllerService,
    private badgeController: BadgeControllerService,
    private lessonController: LessonControllerService,
    public modalController: ModalController) {
    this.route.queryParams.subscribe(params => {
      // If there is a lessonId parameter (navigated from /quiz/{{lessonId}}), load that lesson's quiz.
      // Otherwise check nav extras.
      const paramMap = this.route.snapshot.paramMap;
      if (paramMap.has('lessonId')) {
        this.lessonId = parseInt(paramMap.get('lessonId'), 10);
        this.loadQuiz().subscribe(res => {
          this.init();
        });
      }
      else {
        const currentNav = this.router.getCurrentNavigation();
        if (currentNav && currentNav.extras.state) {

          this.quiz = currentNav.extras.state.quiz;
          currentNav.extras.state.quiz = undefined;
          this.lessonId = this.quiz[0].lessonId;
        }
      }
    });
  }

  ngOnInit() {
    if (this.quiz) {
      this.init();
    }
  }

  init() {
    if (!this.initComplete) {
      this.currentQuestionIndex = 0;
      this.studentAnswers = new Array<number>(this.quiz.length).fill(-1);
      this.initComplete = true;
    }
  }

  nextQuestion() {
    this.storeCurrentChoice();

    this.currentQuestionIndex += 1;

    this.quizQuestionView.selectedAnswer = this.currentAnswerIndex();
  }

  previousQuestion() {
    this.storeCurrentChoice();
    this.currentQuestionIndex -= 1;
  }

  review() {
    this.storeCurrentChoice();
    this.isFinished = true;
  }

  storeCurrentChoice() {
    this.studentAnswers[this.currentQuestionIndex] =
      this.quizQuestionView.selectedAnswer;
  }

  storeAllChoices() {
    this.quizQuestionViews.forEach(
      (q, i) => {
        this.studentAnswers[i] = q.selectedAnswer;
      }
    );
  }

  incrementIndex(delta: number) {
    this.currentQuestionIndex += delta;
  }

  submit() {
    this.storeAllChoices();
    const lessonData = new CompletedLessonData();
    lessonData.completedQuestions = this.quiz.map(
      (q, qI) => {
        return {
          completedChoices: q.choices.map(
            (c, cI) => {
              return {
                chosen: cI === this.studentAnswers[qI],
                content: c.answer,
                correct: c.isTrue
              } as CompletedChoiceData;
            }
          ),
          question: q.text
        } as CompletedQuestionData;
      }
    );
    const username = localStorage.getItem('logedInUsername');
    lessonData.lessonId = this.lessonId;
    lessonData.rating = 1;
    lessonData.studentUserName = username;
    lessonData.timeInSeconds = 1;
    lessonData.wordsRead = 1;
    this.completedLessonService.save(lessonData)
      .subscribe(
        res => {
          window.scroll(0, 0);
          this.isGraded = true;
          this.quizResult = res;

          this.lessonController.getLesson(this.lessonId)
            .subscribe((lesson: any) => {
              if (lesson.badge_id !== null) {
                this.badgeController.giveBadge(lesson.badge_id.toString(), username);
                this.presentAwardReceivedModal(lesson.badge_id);
              }
            });
        }
      );
  }

  async presentAwardReceivedModal(badgeId: number) {
    await AwardReceivedComponent.presentAsModal(this.modalController, badgeId);
  }

  done() {
    this.navCtrl.back(); // TODO: Re-evaluate if this should use routing instead
  }

  questionNumber(i: number): number {
    return i + 1;
  }

  answers(i: number): string[] {
    return this.quiz[i].choices.map(
      o => o.answer
    );
  }

  answerIndex(i: number): number {
    return this.studentAnswers[i];
  }

  answeredCorrectly(i: number): boolean {
    const answer = this.studentAnswers[i];
    if (answer !== -1) {
      return this.quiz[i].choices[answer].isTrue;
    }
    else {
      return false;
    }
  }

  currentQuestionText(): string {
    return this.quiz[this.currentQuestionIndex].text;
  }

  isLast(i: number): boolean {
    return i === this.quiz.length - 1;
  }


  currentQuestionNumber(): number {
    return this.currentQuestionIndex + 1;
  }

  currentAnswers(): string[] {
    return this.answers(this.currentQuestionIndex);
  }

  currentAnswerIndex(): number {
    return this.answerIndex(this.currentQuestionIndex);
  }

  currentIsLast(): boolean {
    return this.isLast(this.currentQuestionIndex);
  }

  loadQuiz(): Observable<any> {
    const subject = new Subject();
    this.quizController.getQuestionsRequest(this.lessonId.toString())
      .subscribe(
        (then: QuizQuestion[]) => {
          if (then !== null) {
            this.quiz = then;
            subject.next(null);
          }
        }
      );
    return subject.asObservable();
  }

  canAdvance(): boolean {
    return this.quizQuestionView && this.quizQuestionView.selectedAnswer !== -1;
  }
}
