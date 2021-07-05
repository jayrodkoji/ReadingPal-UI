import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LessonArray, LessonData } from './lesson-services-models/lesson-data';
import { LessonPostData } from './lesson-services-models/lesson-post-data';


@Injectable({
  providedIn: 'root'
})
export class LessonService {
  lessonsSubject: BehaviorSubject<LessonArray>;
  studentLessonsSubject: BehaviorSubject<LessonArray>;
  lessonSubject: BehaviorSubject<LessonData>;

  constructor(private http: HttpClient) { }

  /**
   * Add Lesson
   */
  public addLesson(data: LessonPostData): Observable<any> {
    const username = localStorage.getItem('logedInUsername');
    const params = new HttpParams().set('name', username);

    console.log(data);

    return this.http.post(
      environment.gatewayBaseUrl + '/lessons/add-lesson',
      data,
      { params });
  }

  /**
   * save last lesson
   */
  public saveLastLesson(lessonId: string, studentId: string): Observable<any> {
    const params = new HttpParams()
      .set('lessonId', lessonId)
      .set('studentId', studentId);

    return this.http.post(
      environment.gatewayBaseUrl + '/lessons/save-last-lesson',
      {},
      { params });
  }


  /**
   * get last lesson
   */
  public getLastLesson(studentId: string): Observable<any[]> {
    const params = new HttpParams().set('studentId', studentId);
    return this.http.get(
      environment.gatewayBaseUrl + '/lessons/get-last-lesson',
      { params }) as Observable<any[]>;
  }

  /**
   * @param data Must have assigned_date, available_until_date, due_date, lesson_id, student_ids (string[])
   */
  public assignLesson(data: any): Observable<any> {
    const s = new Subject();
    this.http.post(
      environment.gatewayBaseUrl + '/lessons/assign-lesson',
      data)
      .subscribe(res => {
        s.next(null);
        s.complete();
      });

    return s.asObservable();
  }

  public getAssignLesson(studentId: number): Observable<any[]> {
    const params = new HttpParams().set('studentId', studentId.toString());
    return this.http.post(
      environment.gatewayBaseUrl + '/lessons/get-assign-lesson',
      {},
      { params }) as Observable<any[]>;
  }

  /**
   * Gets the lessons assigned to a student. Duplicated lessons get filtered by whichever has the highest ID.
   */
  public getAssignLessonFiltered(studentId: number): Observable<any[]> {
    const subj = new Subject<any[]>();

    this.getAssignLesson(studentId)
      .subscribe(
        (res: any[]) => {
          const parsed = res.map(s => s.split(','));
          subj.next(parsed.map(
            (arr: string[]) => ({
              studentId: parseInt(arr[0], 10),
              lessonId: parseInt(arr[1], 10),
              assignedDate: arr[2],
              dueDate: arr[3], // TODO: Verify this is the correct index.
              availableUntilDate: arr[4],
              id: parseInt(arr[5], 10)
            })
          ).sort(
            (a, b) => {
              const lessonIdCmp = a.lessonId - b.lessonId;
              if (lessonIdCmp === 0) {
                return b.id - a.id;
              }
              else {
                return lessonIdCmp;
              }
            }
          ).filter(
            (v, i, arr) => {
              if (i === 0) {
                return true;
              }
              else {
                return arr[i - 1].lessonId !== v.lessonId;
              }
            }
          ));
        }
      );

    return subj.asObservable();
  }

  /**
   * Delete a lesson by id
   */
  public deleteLesson(data: any): Observable<any> {
    if (!this.lessonsSubject) {
      this.lessonsSubject = new BehaviorSubject<LessonArray>(null);
    }

    const params = new HttpParams()
      .set('id', data.id);

    this.http.delete(
      environment.gatewayBaseUrl + '/lessons/delete-lesson',
      { params }
    ).subscribe((result: Array<any>) => {
      const lessons = result.map(obj => new LessonData(obj));
      this.lessonsSubject.next(lessons);
    });

    return this.lessonsSubject.asObservable();
  }

  /**
   * Get individual lesson by id
   */
  getLessonById(id: string): Observable<LessonData> {
    if (!this.lessonSubject) {
      this.lessonSubject = new BehaviorSubject<LessonData>(null);
    }

    const params = new HttpParams()
      .set('lessonID', id);

    return this.http.get<LessonData>(environment.gatewayBaseUrl + '/lessons/get-lesson', { params })
      .pipe(
        tap(_ => console.log(`Lesson fetched: ${id}`)),
        catchError(this.handleError<LessonData>(`Get Lesson id=${id}`))
      );
  }

  /**
   * Get all lessons in catalogue
   */
  getLessons(): Observable<LessonArray> {
    if (!this.lessonsSubject) {
      this.lessonsSubject = new BehaviorSubject<LessonArray>(null);
    }

    this.http.get(
      environment.gatewayBaseUrl + '/lessons/get-lessons')
      .subscribe(
        (result: Array<any>) => {
          const lessons = result.map(obj => new LessonData(obj));
          this.lessonsSubject.next(lessons);
        }
      );

    return this.lessonsSubject.asObservable();
  }

  /**
   * Get lessons for student by id
   */
  getLessonByStudentId(studentId: number): Observable<LessonData[]> {
    if (!this.studentLessonsSubject) {
      this.studentLessonsSubject = new BehaviorSubject<LessonArray>(null);
    }

    const params = new HttpParams()
      .set('studentId', studentId.toString());
    this.http.get(
      environment.gatewayBaseUrl + '/lessons/get-lessons-for-student', { params })
      .subscribe(
        (result: Array<any>) => {
          const lessons = result.map(obj => new LessonData(obj));
          this.studentLessonsSubject.next(lessons);
        }
      );

    return this.studentLessonsSubject.asObservable();
  }

  /**
   * Update lesson by passing lesson data. Lesson will be matched by id on backend.
   */
  public updateLesson(data): Observable<any> {
    if (!this.lessonSubject) {
      this.lessonSubject = new BehaviorSubject<LessonData>(null);
    }

    const username = localStorage.getItem('logedInUsername');
    const params = new HttpParams().set('name', username);
    this.http.post(
      environment.gatewayBaseUrl + '/lessons/update-lesson',
      data,
      { params })
      .subscribe(result => {
        const lesson = new LessonData(result);
        this.lessonSubject.next(lesson);
      });

    return this.lessonSubject.asObservable();
  }

  /**
   * Update if lesson is viewable by student or others
   *
   * TODO: May need to update to have viewable by student seperate from others (catalogue)
   */
  public updateVisibility(lessonId: number, username: string, isViewable: number): Observable<any> {
    if (!this.lessonSubject) {
      this.lessonSubject = new BehaviorSubject<LessonData>(null);
    }

    const params = new HttpParams()
      .set('lessonId', lessonId.toString())
      .set('name', username)
      .set('viewable', isViewable.toString());

    this.http.post(
      environment.gatewayBaseUrl + '/lessons/update-visibility', { params })
      .subscribe(result => {
        const lesson = new LessonData(result);
        this.lessonSubject.next(lesson);
      });

    return this.lessonSubject.asObservable();
  }

  /**
   * Allow updating lesson presentation order.
   */
  public updateSequence(seqNum: number, lessonId: number): Observable<any> {
    const params = new HttpParams()
      .set('desiredSequenceNumber', seqNum.toString())
      .set('lessonId', lessonId.toString());


    return this.http.put(
      environment.gatewayBaseUrl + '/lessons/update-visibility', { params }
    );
  }

  /**
   * Will be error handling
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
