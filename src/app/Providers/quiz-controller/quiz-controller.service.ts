import { Injectable } from '@angular/core';
import {QuestionChoice, QuestionChoiceAdd, QuestionChoiceUpdate, QuizQuestion, QuizQuestionPost} from './quiz-data';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuizControllerService {
  constructor(private http: HttpClient) {}

  // Question controller
  getQuestionsRequest(lessonId: string): Observable<QuizQuestion[]> {
    const quizSubject = new BehaviorSubject<QuizQuestion[]>(null);
    const params = new HttpParams().set('lessonId', lessonId);

    this.http.get(
      environment.gatewayBaseUrl + '/questions/get-questions-with-lesson-id',
      {params})
      .subscribe(
        (result: any[]) => {
          quizSubject.next(QuizQuestion.questionsFromJson(result));
          quizSubject.complete();
        }
      );

    return quizSubject.asObservable();
  }

  addQuestionRequest(question: QuizQuestionPost): Observable<QuizQuestion> {
    const questionSubject = new Subject<QuizQuestion>();

    this.http.post(
      environment.gatewayBaseUrl + '/questions/add-question-with-choices',
      question)
      .subscribe(
        (result: any) => {
          questionSubject.next(new QuizQuestion(result));
          questionSubject.complete();
        }
      );

    return questionSubject.asObservable();
  }

  updateQuestionRequest(question: QuizQuestion): Observable<QuizQuestion> {
    const questionSubject = new BehaviorSubject<QuizQuestion>(null);

    this.http.post(
      environment.gatewayBaseUrl + '/questions/update-question-text',
      question)
      .subscribe(
        (result: any) => {
          questionSubject.next(new QuizQuestion(result));
        }
      );

    return questionSubject.asObservable();
  }

  deleteQuestionRequest(questionId: number): Observable<any> {
    const params = new HttpParams().set('id', questionId.toString());

    return this.http.delete(
      environment.gatewayBaseUrl + '/questions/delete-question',
      {params});
  }


  // Choice controller
  getChoicesRequest(questionId: number): Observable<QuestionChoice[]> {
    const choicesSubject = new BehaviorSubject<QuestionChoice[]>(null);
    const params = new HttpParams().set('id', questionId.toString());

    this.http.get(
      environment.gatewayBaseUrl + '/choices/get-choices-with-question-id',
      {params})
      .subscribe(
        (result: any[]) => {
          choicesSubject.next(QuestionChoice.choicesFromJson(result));
        }
      );

    return choicesSubject.asObservable();
  }

  addChoiceRequest(choice: QuestionChoiceAdd): Observable<QuestionChoice> {
    const choiceSubject = new BehaviorSubject<QuestionChoice>(null);

    this.http.post(
      environment.gatewayBaseUrl + '/choices/add-choice',
      choice)
      .subscribe(
        (result: any) => {
          choiceSubject.next(new QuestionChoice(result));
        }
      );

    return choiceSubject.asObservable();
  }

  updateChoiceRequest(question: QuestionChoiceUpdate): Observable<any> {
    const questionSubject = new BehaviorSubject<any>(null);

    this.http.post(
      environment.gatewayBaseUrl + '/choices/update-choice',
      question)
      .subscribe(
        (result: any) => {
          questionSubject.next(result);
        }
      );

    return questionSubject.asObservable();
  }

  deleteChoiceRequest(choiceId: number): Observable<any> {
    const res = new BehaviorSubject<any>(null);
    const params = new HttpParams().set('id', choiceId.toString());

    this.http.delete(
      environment.gatewayBaseUrl + '/choices/delete-choice',
      {params})
      .subscribe(
        (result: any) => {
          res.next(result);
        }
      );

    return res.asObservable();
  }

  /*private localInitGetQuiz(quizId: number): Observable<QuizData> {
    if (!this.quizDataSubject)
    {
      this.quizDataSubject = new BehaviorSubject<QuizData>(null);

      fetch(
          './assets/sample-json/quiz-1-sample.json')
          .then(result => result.json())
          .then(
              result => {
                this.quizData = result as QuizData;
                this.quizDataSubject.next(this.quizData);
              }
          );
    }

    return this.quizDataSubject.asObservable();
  }*/

}
