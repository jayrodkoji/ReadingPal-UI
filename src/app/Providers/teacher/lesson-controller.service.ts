import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {LessonData, LessonArray} from '../lesson-services/lesson-services-models/lesson-data';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LessonControllerService {
  private lessonsSubject: BehaviorSubject<LessonArray>;

  constructor(
    private http: HttpClient) {
    this.remoteSetup();
  }

  public getLessons(): Observable<LessonArray> {
    return this.lessonsSubject.asObservable();
  }

  public getLesson(lessonId: number): Observable<any> {
    const params = new HttpParams().set('lessonID', lessonId.toString());
    return this.http.get(
      environment.gatewayBaseUrl + '/lessons/get-lesson',
      {params}
    );
  }

  private remoteSetup() {
    if (!this.lessonsSubject) {
      this.lessonsSubject = new BehaviorSubject<LessonArray>(null);
      this.http.get(
        environment.gatewayBaseUrl + '/lessons/get-lessons')
        .subscribe(
          (result: Array<any>) => {
            const lessons = result.map(obj => new LessonData(obj));
            this.lessonsSubject.next(lessons);
          }
        );
    }
  }
}
