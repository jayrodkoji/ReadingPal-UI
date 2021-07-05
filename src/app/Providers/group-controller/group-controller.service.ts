import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupControllerService {
  constructor(private http: HttpClient) { }

  private static buildUrl(suffix: string) {
    return environment.gatewayBaseUrl + '/groups/' + suffix;
  }

  addGroup(classId: number, name: string): Observable<GroupData> {
    return this.http.post(
      GroupControllerService.buildUrl('add-group'),
      {classId, name}
    ) as Observable<GroupData>;
  }

  addStudentToGroup(groupId: number, studentId: number): Observable<string[]> {
    const params = new HttpParams()
      .set('groupId', groupId.toString())
      .set('student_id', studentId.toString());
    return this.http.post(
      GroupControllerService.buildUrl('add-student-to-group'),
      {},
      {params}
    ) as Observable<string[]>;
  }

  deleteGroup(classId: number, groupId: number): Observable<GroupData[]> {
    const params = new HttpParams()
      .set('classId', classId.toString())
      .set('groupId', groupId.toString());
    return this.http.delete(
      GroupControllerService.buildUrl('delete-group'),
      {params}
    ) as Observable<GroupData[]>;
  }

  deleteStudentFromGroup(groupId: number, studentId: number): Observable<string[]> {
    const params = new HttpParams()
      .set('groupId', groupId.toString())
      .set('student_id', studentId.toString());
    return this.http.delete(
      GroupControllerService.buildUrl('delete-student-from-group'),
      {params}
    ) as Observable<string[]>;
  }

  getAllGroups(): Observable<GroupData[]> {
    return this.http.get(
      GroupControllerService.buildUrl('get-all-groups')
    ) as Observable<GroupData[]>;
  }

  getGroupsByClassId(classId: number): Observable<GroupData[]> {
    const params = new HttpParams()
      .set('classId', classId.toString());
    return this.http.get(
      GroupControllerService.buildUrl('get-groups-by-classid'),
      {params}
    ) as Observable<GroupData[]>;
  }

  getStudentsInGroup(groupId: number): Observable<string[]> {
    const params = new HttpParams()
      .set('groupId', groupId.toString());
    return this.http.get(
      GroupControllerService.buildUrl('get-students-in-group'),
      {params}
    ) as Observable<string[]>;
  }
}



class GroupData
{
  public classId: number;
  public id: number;
  public name: string;
}



