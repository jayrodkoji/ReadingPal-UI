import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { LessonPostData } from '../lesson-services/lesson-services-models/lesson-post-data';

@Injectable({
  providedIn: 'root'
})
export class LessonCreatorService {

  constructor(private http: HttpClient) { }

  public submit(data: LessonPostData): Observable<any> {
    const username = localStorage.getItem('logedInUsername');
    const params = new HttpParams().set('name', username);
    return this.http.post(
      environment.gatewayBaseUrl + '/lessons/add-lesson',
      data,
      {params});
  }

  public updateLesson(data: LessonPostData): Observable<any> {
    const username = localStorage.getItem('logedInUsername');
    const params = new HttpParams().set('name', username);
    return this.http.post(
      environment.gatewayBaseUrl + '/lessons/update-lesson',
      data,
      {params});
  }

  public delete(data: any): Observable<any> {
    return this.http.delete(
      environment.gatewayBaseUrl + '/lessons/delete-lesson',
      {params: {id:data.id}});
  }
}
