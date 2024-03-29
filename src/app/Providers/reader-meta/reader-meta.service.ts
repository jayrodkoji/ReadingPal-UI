import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReaderMeta } from './model/readerMetaData';
import { AnnotationData } from './model/annotationData';

@Injectable({
  providedIn: 'root'
})
export class ReaderMetaService {

  constructor(private http: HttpClient) { }

  addReaderMeta(data: ReaderMeta): Observable<any> {
    return this.http.post(this.buildUrl('add-reader-meta'), data);
  }

  getReaderMeta(username: string, bookId: number): Observable<any> {
    const params = new HttpParams()
      .set('username', username.toString())
      .set('book_id', bookId.toString());

    return this.http.get(this.buildUrl('get-reader-meta'), { params });
  }

  updateReaderMeta(data: ReaderMeta): Observable<any> {
    return this.http.post(this.buildUrl('update-reader-meta'), data);
  }

  getHighlights(username: string) {
    const params = new HttpParams()
      .set('username', username.toString());

    return this.http.get(this.buildUrl('get-highlight-colors'), { params });
  }

  addHighlight(username: string, color: string, gridIndex: string) {
    const newHighlight = {
      username,
      color,
      grid_index: gridIndex,
      page: 0
    };

    return this.http.post(this.buildUrl('add-highlight-color'), newHighlight);
  }

  deleteHighlight(id: number, username: string) {
    const params = new HttpParams()
      .set('id', id.toString())
      .set('username', username);

    return this.http.delete(this.buildUrl('delete-highlight-color'), { params });
  }

  addAnnotation(data: AnnotationData) {
    return this.http.post(this.buildUrl('add-annotation'), data);
  }

  updateAnnotation(data: AnnotationData) {
    return this.http.post(this.buildUrl('update-annotation'), data);
  }

  getAnnotations(username: string, bookId: number) {
    const params = new HttpParams()
      .set('username', username)
      .set('book_id', bookId.toString());

    return this.http.get(this.buildUrl('get-annotations'), { params });
  }

  getTeacherAnnotations(username: string, bookId: number) {
    const params = new HttpParams()
      .set('username', username)
      .set('book_id', bookId.toString());

    return this.http.get(this.buildUrl('get-teacher-annotations'), { params });
  }

  getAnnotationById(id: string) {
    const params = new HttpParams()
      .set('id', id);

    return this.http.get(this.buildUrl('get-annotation-by-id'), { params });
  }

  deleteAnnotation(id: number, username: string, bookId: number) {
    const params = new HttpParams()
      .set('id', id.toString())
      .set('username', username)
      .set('book_id', bookId.toString());

    return this.http.delete(this.buildUrl('delete-annotation'), { params });
  }

  private buildUrl(suffix: string) {
    return environment.gatewayBaseUrl + '/reader-meta/' + suffix;
  }
}
