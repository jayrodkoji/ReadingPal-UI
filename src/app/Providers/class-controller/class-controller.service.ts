import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {ClassArray, ClassData, NewClassData} from './class-data';

@Injectable({
  providedIn: 'root'
})
export class ClassControllerService {

  constructor(private http: HttpClient) { }

  getAllClasses(): Observable<ClassArray> {
    return this.http.get(this.buildUrl('get-all-classes')) as Observable<ClassArray>;
  }

  addClass(data: NewClassData): Observable<any> {
    return this.http.post(this.buildUrl('add-class'), data);
  }

  addStudentToClass(data: any): Observable<any> {
      return this.http.post(this.buildUrl('add-student-to-class'), data);
  }

  deleteClass(data: any): Observable<any> {
    const params = new HttpParams()
      .set('id', data.id);
    return this.http.delete(this.buildUrl('delete-class'), {params});

  }

  getClassesWithTeacherName(data: any): Observable<ClassArray> {
    const params = new HttpParams()
      .set('uName', data.uName);
    return this.http.get(this.buildUrl('get-classes-with-teacher-name'), {params}) as Observable<ClassArray>;
  }

  getStudentsWithClassId(data: any): Observable<any> {
    const params = new HttpParams()
      .set('id', data.id);
    return this.http.get(this.buildUrl('get-students-with-class-id'), {params});
  }

  updateClass(data: any): Observable<any> {
    return this.http.post(this.buildUrl('update-class'), data);
  }

  private buildUrl(suffix: string) {
    return environment.gatewayBaseUrl + '/classes/' + suffix;
  }

}
