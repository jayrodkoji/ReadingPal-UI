import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompletedLessonArray, CompletedLessonData, SavedLessonData } from './Model/completed-lesson';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompletedLessonService {

  constructor(private http: HttpClient) { }

  addRating(data: any): Observable<string> {
    return this.http.post(this.buildUrl('addRating'), data) as Observable<string>;
  }
  
  getLastStreak(data: any): Observable<number> {
    const params = new HttpParams()
    .set('id', data.id);
    return this.http.get(this.buildUrl('getLastStreak'), {params}) as Observable<number>;
  }

  getRating(data: any): Observable<number> {
    const params = new HttpParams()
    .set('lessonId', data.lessonId);
    return this.http.get(this.buildUrl('getRating'), {params}) as Observable<number>;
  }

  getStatsForClass(data: any): Observable<CompletedLessonArray> {
    const params = new HttpParams()
    .set('id', data.id);
    return this.http.get(this.buildUrl('getStatsFor'), {params}) as Observable<CompletedLessonArray>;

  }

  getStatsForStudent(data: any): Observable<CompletedLessonData> {
    const params = new HttpParams()
    .set('id', data.id);
    return this.http.get(this.buildUrl('getStatsForStudent'), {params}) as Observable<CompletedLessonData>;

  }

  save(data: any): Observable<SavedLessonData> {
    return this.http.post(this.buildUrl('save'), data) as Observable<SavedLessonData>;
  }

  private buildUrl(suffix: string) {
    return environment.gatewayBaseUrl + '/completed-lesson/' + suffix;
  }

}
