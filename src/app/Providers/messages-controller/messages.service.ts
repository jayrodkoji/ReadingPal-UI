import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Message} from "./model/message";
import {BookInfo} from "../../model/book-info";

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
   * @param teacher_username
   * @param student_username
   * @param book_id
   */
  getMessages(teacher_username: string, student_username: string, book_id: number): Observable<any> {
    const params = new HttpParams()
        .set('teacher_username', teacher_username)
        .set('student_username', student_username)
        .set('book_id', book_id.toString());

    return this.http.get(this.buildUrl('get-messages'), { params });
  }

  /**
   * Get all messages for teacher
   * @param teacher_username
   */
  getTeachersMessages(teacher_username: string): Observable<any> {
    const params = new HttpParams()
        .set('teacher_username', teacher_username)

    this.http.get(this.buildUrl('get-teacher-messages'), { params })
        .subscribe((result: Array<Message>) => {
              if(result) {
                  this.messages.next(result);
              }
          });

    return this.messages.asObservable();

  }

    /**
     * Get all messages for student
     * @param student_username
     */
    getStudentsMessages(student_username: string): Observable<any> {
        const params = new HttpParams()
            .set('student_username', student_username)

        this.http.get(this.buildUrl('get-students-messages'), { params })
            .subscribe((res: Array<Message>) => {
                if(res) {
                    this.messages.next(res);
                }
            })

        return this.messages.asObservable();
    }

 /**
   * Get resolved messages for teacher
   * @param teacher_username
   */
  getResolvedTeachersMessages(teacher_username: string): Observable<any> {
    const params = new HttpParams()
        .set('teacher_username', teacher_username)

    return this.http.get(this.buildUrl('get-resolved-teacher-messages'), { params })

  }

 /**
   * Get unresolved messages for teacher
   * @param teacher_username
   */
  getUnresolvedTeachersMessages(teacher_username: string): Observable<any> {
    const params = new HttpParams()
        .set('teacher_username', teacher_username)

    return this.http.get(this.buildUrl('get-unresolved-teacher-messages'), { params })
  }

    /**
     * Update message by passing in updated message object
     * @param message: updated message object
     * @param role: role of update to update behaviorSubject
     */
  updateMessage(message: Message): Observable<any>{
    this.http.post(this.buildUrl('update-message'), message)
        .subscribe((res: Message) => {
            if(res) {
                let msgLst = this.messages.getValue()
                if(msgLst) {
                    let index = msgLst.findIndex(msg => msg.id === message.id)
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
