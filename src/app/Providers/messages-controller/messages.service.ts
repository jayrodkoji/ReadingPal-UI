import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Message } from './model/message';
@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  messages: BehaviorSubject<Array<Message>> = new BehaviorSubject<Array<Message>>(null);

  constructor(
    private http: HttpClient
  ) { }

  addMessage(data: Message): Observable<any> {
    return this.http.post(this.buildUrl('add-message'), data);
  }

  /**
   * Get all messages between student and teacher for given book
   */
  getMessages(teacherUsername: string, studentUsername: string, bookId: number): Observable<any> {
    const params = new HttpParams()
      .set('teacher_username', teacherUsername)
      .set('student_username', studentUsername)
      .set('book_id', bookId.toString());

    return this.http.get(this.buildUrl('get-messages'), { params });
  }

  /**
   * Get all messages for teacher
   */
  getTeachersMessages(teacherUsername: string): Observable<any> {
    const params = new HttpParams()
      .set('teacher_username', teacherUsername);

    this.http.get(this.buildUrl('get-teacher-messages'), { params })
      .subscribe((result: Array<Message>) => {
        if (result) {
          this.messages.next(result);
        }
      });

    return this.messages.asObservable();

  }

  /**
   * Get all messages for student
   */
  getStudentsMessages(studentUsername: string): Observable<any> {
    const params = new HttpParams()
      .set('studentUsername', studentUsername);

    this.http.get(this.buildUrl('get-students-messages'), { params })
      .subscribe((res: Array<Message>) => {
        if (res) {
          this.messages.next(res);
        }
      });

    return this.messages.asObservable();
  }

  /**
   * Get resolved messages for teacher
   */
  getResolvedTeachersMessages(teacherUsername: string): Observable<any> {
    const params = new HttpParams()
      .set('teacherUsername', teacherUsername);

    return this.http.get(this.buildUrl('get-resolved-teacher-messages'), { params });

  }

  /**
   * Get unresolved messages for teacher
   */
  getUnresolvedTeachersMessages(teacherUsername: string): Observable<any> {
    const params = new HttpParams()
      .set('teacher_username', teacherUsername);

    return this.http.get(this.buildUrl('get-unresolved-teacher-messages'), { params });
  }

  /**
   * Update message by passing in updated message object
   */
  updateMessage(message: Message): Observable<any> {
    this.http.post(this.buildUrl('update-message'), message)
      .subscribe((res: Message) => {
        if (res) {
          const msgLst = this.messages.getValue();
          if (msgLst) {
            const index = msgLst.findIndex(msg => msg.id === message.id);
            msgLst[index] = message;
            this.messages.next(msgLst);
          } else {
            this.messages.next([message]);
          }
        }
      });

    return this.messages.asObservable();
  }


  private buildUrl(suffix: string) {
    return environment.gatewayBaseUrl + '/messages/' + suffix;
  }
}
