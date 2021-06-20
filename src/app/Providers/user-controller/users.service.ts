import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { UsersModel, Role } from "./model/users-model";

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private teachersListSubject: BehaviorSubject<UsersModel[]> = new BehaviorSubject<UsersModel[]>(null);
  private rolesListSubject: BehaviorSubject<Role[]> = new BehaviorSubject<Role[]>(null);
  private usersListSubject: BehaviorSubject<UsersModel[]> = new BehaviorSubject<UsersModel[]>(null);

  constructor(
      private http: HttpClient
  ) { }

  /**
   * Add User
   */
  public addUser(data: UsersModel): Observable<any> {
    return this.http.post(
        environment.UserServiceURL + '/users/addUser', data)
  }

  /**
   * Update User
   */
  public updateUser(data: UsersModel): Observable<any> {
    return this.http.post(
        environment.UserServiceURL + '/users/updateUser', data)
  }

  /**
   * Delete User
   */
  public deleteUser(username: string): Observable<any> {
    let params = new HttpParams().set('username', username);

    return this.http.delete(
        environment.UserServiceURL + '/users/deleteUser', { params })
  }

  /**
   * Get User
   */
  public getUser(userId: number): Observable<any> {
    return this.http.get(`${environment.UserServiceURL}/users/${userId}`)
  }

  /**
   * Get User Roles
   */
  public getUserRoles(): Observable<any> {
    this.http.get(
        environment.UserServiceURL + '/users/getUserRoles')
        .subscribe((res: Array<any>) => {
          const roles = res.map(obj => new Role(obj));
          this.rolesListSubject.next(roles);
    })

    return this.rolesListSubject.asObservable();
  }

  /**
   * Get Users
   */
  public getUsers(): Observable<any> {
    this.http.get(environment.UserServiceURL + '/users/getUsers')
        .subscribe((res: Array<any>) => {
          const teachers = res.map(obj => new UsersModel(obj));
          this.usersListSubject.next(teachers);
        })

    return this.usersListSubject.asObservable();
  }

  /**
   * Get Teachers
   */
  public getTeachers(): Observable<any> {
    this.http.get(environment.UserServiceURL + '/users/getTeachers')
        .subscribe((res: Array<any>) => {
          const teachers = res.map(obj => new UsersModel(obj));
          this.teachersListSubject.next(teachers);
        })

    return this.teachersListSubject.asObservable();
  }

  /**
   * update Password
   */
  public updatePassword(username: string, password: string): Observable<any> {
    return this.http.post(
        environment.UserServiceURL + '/users/updateUserPassword', { newPassword: password, userName: username} );
  }

  /**
   * TODO: Basic Auth
   */
}
