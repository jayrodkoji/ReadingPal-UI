import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import { BasicInfoComponent, LessonDataBasicInfo } from './basic-info/basic-info.component';
import { AddReadingComponent, LessonDataReadingInfo } from './add-reading/add-reading.component';
import { LessonPostData } from '../../../Providers/lesson-services/lesson-services-models/lesson-post-data';
import {BehaviorSubject, forkJoin, Observable, Subject} from 'rxjs';
import { QuizControllerService } from '../../../Providers/quiz-controller/quiz-controller.service';
import { QuizQuestionPost } from '../../../Providers/quiz-controller/quiz-data';
import { QuizComponent } from './quiz/quiz.component';
import { AwardComponent } from './award/award.component';
import { LessonService } from 'src/app/Providers/lesson-services/lesson.service';
import {ActivatedRoute, Router} from '@angular/router';
import { LessonData } from 'src/app/Providers/lesson-services/lesson-services-models/lesson-data';
import { NavController } from '@ionic/angular';
import { VocabularyComponent } from './vocabulary/vocabulary.component';
import { VocabularyServicesService } from 'src/app/Providers/vocabulary-services/vocabulary-services.service';
import {BadgeControllerService} from '../../../Providers/badges/badge-controller.service';

@Component({
  selector: 'app-create-lesson',
  templateUrl: './create-lesson.page.html',
  styleUrls: ['./create-lesson.page.scss'],
})
export class CreateLessonPage implements OnInit {
  forms = ['basics', 'reading', 'vocabulary', 'quiz', 'award'];
  studentView: boolean = false;
  publishing: boolean = false;
  addAward: boolean = false;
  addVocabulary: boolean = false;
  addQuiz: boolean = false;
  hasRequirements: boolean = false;

  flashColor = "default-color"

  lesson: LessonData;
  initialReadingInfo: LessonDataReadingInfo;

  @ViewChild(BasicInfoComponent)
  private basicInfoComponent: BasicInfoComponent;

  @ViewChild(AddReadingComponent)
  private addReadingComponent: AddReadingComponent;

  @ViewChild(AwardComponent)
  private awardComponent: AwardComponent;

  @ViewChild(QuizComponent)
  private quizComponent: QuizComponent;

  @ViewChild(VocabularyComponent)
  private vocabComponent: VocabularyComponent;

  lessonId = -1;
  initialBadge;
  initialQuizzes;
  initialWords;

  isEdit = false;
  stateLesson;

  constructor(
    private lessonCreator: LessonService,
    private quizController: QuizControllerService,
    private VocabularyServices: VocabularyServicesService,
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private badgeController: BadgeControllerService,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) {
    const currentNav = this.router.getCurrentNavigation();
    if (currentNav) {
      const state = currentNav.extras.state;
      if (state) {
        if (state.lesson) {
          this.stateLesson = state.lesson;

        }

        if (state.isEdit !== undefined) {
          this.isEdit = state.isEdit;
          //console.log({isEdit: this.isEdit});
        }
      }
    }
  }

  ngOnInit() {
    if (this.stateLesson !== undefined) {
      this.lesson = this.stateLesson;
      this.cdr.detectChanges();
      this.lessonId = this.lesson.id;

      this.initialReadingInfo = new LessonDataReadingInfo();
      this.initialReadingInfo.bookId = this.lesson.bookId;
      this.initialReadingInfo.bookStart = this.lesson.start_page;
      this.initialReadingInfo.bookEnd = this.lesson.end_page;

      if (this.lesson.badgeId !== null) {
        this.badgeController.getBadgeById(this.lesson.badgeId.toString())
          .subscribe(badge => {
            this.initialBadge = badge[0];
            this.addAward = true;
            this.cdr.detectChanges();
          });
      }

      this.quizController.getQuestionsRequest(this.lessonId.toString())
        .subscribe(questions => {
          if (questions) {
            // TODO: Figure out if this needs to be deep copied or not.
            this.initialQuizzes = [questions];
            //console.log({initialQuizzes: this.initialQuizzes});
            this.addQuiz = true;
            this.cdr.detectChanges();
          }
        });

      this.VocabularyServices.getVocab(this.lessonId.toString())
        .subscribe(words => {
          if (words) {
            this.initialWords = words;
            this.addVocabulary = true;
            this.cdr.detectChanges();
          }
        });
    }
  }

  // Posts the lesson and all questions.
  publish() {
    this.publishing = true;
    this.createLesson()
      .subscribe(
        () => {
          /*forkJoin([
            this.publishQuestions(),
            this.publishVocab(),
            this.publishLessonAssignment()
          ]).subscribe(res => {
            console.log({res});
            this.navCtrl.back();
            this.publishing = false;
          });*/
          forkJoin([
            this.publishQuestions(),
            this.publishVocab(),
            this.publishLessonAssignment()
          ]).subscribe(
            val => { },
            err => { },
            () => {
              this.publishing = false;
              this.location.back();
            }
          );
        });
  }

  publishQuestions(): Observable<any> {
    const res = new BehaviorSubject<any>(null);
    const subject = new Subject<any>();

    subject.asObservable().subscribe(
      () => {
        this.createQuestions()
          .subscribe(() => {
            //console.log('publishQuestions.complete()');
            res.next([]);
            res.complete();
          });
      }
    );

    if (this.isEdit) {
      this.deleteQuestions()
        .subscribe(next => {
          subject.next();
        });
    }
    else {
      subject.next();
    }

    return res;
  }

  publishVocab(): Observable<any> {
    const res = new BehaviorSubject<any>(null);
    const subject = new Subject<any>();

    subject.asObservable().subscribe(
      () => {
        this.createVocab()
          .subscribe(() => {
            //console.log('publishVocab.complete()');
            res.next(null);
            res.complete();
          });
      }
    );

    if (this.isEdit) {
      // TODO: Use deleteVocab.
      //console.log('publishVocab.complete()');
      const res2 = new BehaviorSubject(null);
      res2.complete();
      return res2.asObservable();
    }
    else {
      subject.next();
    }

    return res;
  }

  publishLessonAssignment(): Observable<any> {
    // TODO: Add available until date to basic info component?
    if (this.basicInfoComponent.basicInfo.studentIds &&
      this.basicInfoComponent.basicInfo.studentIds.length > 0) {
      return this.lessonCreator.assignLesson({
        assigned_date: this.basicInfoComponent.basicInfo.assignedDate,
        available_until_date: this.basicInfoComponent.basicInfo.dueDate,
        due_date: this.basicInfoComponent.basicInfo.dueDate,
        lesson_id: this.lessonId,
        //student_ids: this.basicInfoComponent.basicInfo.studentIds.map(o => o.toString())
        student_ids: this.basicInfoComponent.basicInfo.studentIds
      });
    }
    else {
      const subject = new BehaviorSubject(null);
      subject.complete();
      return subject;
    }

    /*const res = new Subject<any>();
    const subject = new Subject<any>();

    subject.asObservable().subscribe(
      () => {
        this.assignLesson()
          .subscribe(() => {
            res.next();
            res.complete();
          });
      }
    );

    if (this.isEdit) {
      // TODO: Use deleteLessonAssignment.

    }
    else {
      subject.next();
    }

    return res;*/
  }

  createLesson(): Observable<any> {
    const lessonData =
      this.createLessonPostData(
        this.basicInfoComponent.basicInfo,
        this.addReadingComponent.readingInfo) as any;

    if (this.isEdit) {
      lessonData.id = this.lessonId;
      return this.updateLessonFromData(lessonData);
    }
    else {
      const res = new Subject();
      this.createLessonFromData(lessonData)
        .subscribe(lesson => {
          this.lessonId = lesson.id;
          res.next(lesson);
        });
      return res.asObservable();
    }
  }

  createLessonFromData(data: LessonPostData): Observable<any> {
    return this.lessonCreator.addLesson(data);
  }

  updateLessonFromData(data: any): Observable<any> {
    const subject = new Subject();
    this.lessonCreator.updateLesson(data)
      .subscribe(res => {
        if (res !== null) {
          subject.next(res);
        }
      });
    return subject.asObservable();
  }

  // Combines the various child components' data into a LessonPostData object.
  createLessonPostData(
    basicInfo: LessonDataBasicInfo, readingInfo: LessonDataReadingInfo
  ): LessonPostData {
    const awardId = this.awardComponent ? this.awardComponent.getSelectedBadgeId() : null;
    const username = localStorage.getItem('logedInUsername');

    return new LessonPostData(
      readingInfo.bookId,
      username,
      basicInfo.level.toString(),
      '',
      readingInfo.bookStart,
      readingInfo.bookEnd,
      null,
      basicInfo.lessonName,
      0,
      null,
      null,
      awardId
    );
  }

  deleteQuestions(): Observable<any> {
    const quiz = this.initialQuizzes[0] as any[];
    //console.log({quiz});
    if (quiz.length === 0) {
      return new BehaviorSubject(null).asObservable();
    }
    else {
      return forkJoin(quiz.map(
        q => this.quizController.deleteQuestionRequest(q.id)
      ));
    }
  }

  // TODO: Implement once the API is available
  /*deleteVocab(): Observable<any> {

  }*/

  // Submits all the quiz questions as post request.
  // Does so asynchronously, using forkJoin.
  // On success, should redirect to the lessons page
  createQuestions(): Observable<any> {
    if (this.quizComponent && this.quizComponent.quizCardComponent.questionPosts.length > 0) {
      return forkJoin(this.quizComponent.quizCardComponent.questionPosts.map(
        q => this.createQuestion(q, this.lessonId)
      ));
    }
    else {
      return new BehaviorSubject(null).asObservable();
    }
  }

  // Post request for creating a single question.
  // Takes lessonId to modify the QuizQuestionPost.
  createQuestion(question: QuizQuestionPost, lessonId: number): Observable<any> {
    question.lessonId = lessonId;
    return this.quizController.addQuestionRequest(question);
  }

  createVocab(): Observable<any> {
    if (this.vocabComponent && this.vocabComponent.words.length > 0) {
      const subject = new Subject();
      this.VocabularyServices.addVocabulary(
        this.lessonId.toString(),
        this.vocabComponent.words
      ).subscribe(res => {
        if (res) {
          subject.next(res);
        }
      });
      return subject.asObservable();
    }
    else {
      return new BehaviorSubject(null).asObservable();
    }
  }

  // TODO: Implement once student selection is integrated.
  /*assignLesson(): Observable<any> {

  }*/


  isComplete() {
    if (this.basicInfoComponent) {
      return this.basicInfoComponent.isComplete() && this.addReadingComponent.isComplete();
    }
    else {
      return false;
    }
  }
}
