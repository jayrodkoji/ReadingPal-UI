import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {StudentAsUserData, StudentData} from './student-data';
import {BehaviorSubject, Observable} from 'rxjs';
import {UsersService} from '../user-controller/users.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  studentData: StudentData;
  studentsDataSubject: BehaviorSubject<Array<StudentData>> = new BehaviorSubject<Array<StudentData>>(null);

  constructor(
      private http: HttpClient,
      private userService: UsersService,
  ) {}

  /**
   * Add Student
   */
  public addStudent(data: StudentData): Observable<any> {
    return this.http.post(
        environment.gatewayBaseUrl + '/students/addStudent', data);
  }

  /**
   * Update Student
   */
  public updateStudent(data: StudentData): Observable<any> {
    console.log(data);
    return this.http.post(
        environment.gatewayBaseUrl + '/students/updateStudent', data);
  }

  /**
   * Delete Student by ID
   */
  public deleteStudentByID(id: number): Observable<any> {
    const params = new HttpParams().set('id', id.toString());

    return this.http.delete(
        environment.gatewayBaseUrl + '/students/deleteStudent', { params });
  }

  /**
   * Delete Student by username
   */
  public deleteStudentByUsername(username: string): Observable<any> {
    const params = new HttpParams().set('userName', username);

    return this.http.delete(
        environment.gatewayBaseUrl + '/students/deleteStudentWithName', { params });
  }

  /**
   * Get Student by ID
   */
  public getStudentByID(id: number): Observable<any> {
    const params = new HttpParams().set('id',  id.toString());

    return this.http.get(environment.gatewayBaseUrl + '/students/getStudent', { params });
  }

  /**
   * Get Student by username
   */
  public getStudentByUsername(username: string): Observable<any> {
    const params = new HttpParams().set('userName',  username);

    return this.http.get(environment.gatewayBaseUrl + '/students/getStudentByUserName', { params });
  }

  /**
   * Get Students
   */
  public getStudents(): Observable<any> {
    this.http.get(environment.gatewayBaseUrl + '/students/getStudents')
        .subscribe((res: Array<any>) => {
          const students = res.map(obj => new StudentData(obj));
          this.studentsDataSubject.next(students);
        });

    return this.studentsDataSubject.asObservable();
  }

  /**
   * Get Student info by ID
   */
  public getStudentInfoByID(id: number): Observable<any> {
    const params = new HttpParams().set('id',  id.toString());

    return this.http.get(environment.gatewayBaseUrl + '/students/student-info-by-id', { params });
  }

  /**
   * Get Student info by username
   */
  public getStudentInfo(username: string): Observable<any> {
    const params = new HttpParams().set('studentUserName ',  username);

    return this.http.get(environment.gatewayBaseUrl + '/students/student-info', { params });
  }

  /**
   * Get a student with user fields as well
   * @param username: Student username
   */
  // getStudentAsUserByUsername(username: string): StudentAsUserData {
  //   this.getStudentByUsername(username).subscribe((res) => {
  //     if(res){
  //       this.userService.getUser(UserId).subscribe((result: StudentAsUserData) => {
  //         if(result){
  //           let student = res;
  //           student.readingLevel = res.reading_level;
  //           student.grade = res.grade;
  //         }
  //       })
  //     }
  //   })

  //   return
  // }
}
