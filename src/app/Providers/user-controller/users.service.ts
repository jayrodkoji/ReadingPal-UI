import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { UsersModel, Role } from "./model/users-model";
import { Apollo } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private teachersListSubject: BehaviorSubject<UsersModel[]> = new BehaviorSubject<UsersModel[]>(null);
  private rolesListSubject: BehaviorSubject<Role[]> = new BehaviorSubject<Role[]>(null);
  private usersListSubject: BehaviorSubject<UsersModel[]> = new BehaviorSubject<UsersModel[]>(null);
  
  loading: boolean;

  constructor(
      private http: HttpClient,
      private apollo: Apollo
  ) { }

  /**
   * Create User
   */
  public addUser(data: UsersModel): Observable<any> {
    return this.http.post(
        environment.graphqlApiGateway + '/users', data)
  }

  /**
   * Update User
   */
  public updateUser(data: UsersModel): Observable<any> {
    return this.http.post(
        environment.graphqlApiGateway + '/users/updateUser', data)
  }

  /**
   * Delete User
   */
  public deleteUser(username: string): Observable<any> {
    let params = new HttpParams().set('username', username);

    return this.http.delete(
        environment.graphqlApiGateway + '/users/deleteUser', { params })
  }

  /**
   * Get Users
   */
   public getUsers(query: any): Observable<any> {
    this.apollo.watchQuery<any>({
      query: query
    })
      .valueChanges
      .subscribe(({ data }) => {
        this.usersListSubject.next(data.users)
      });

    return this.usersListSubject.asObservable();
  }

  /**
   * Get User
   */
  public getUser(userId: number): Observable<any> {
    return null;

    // return this.http.get(`${environment.graphqlApiGateway}/users/`)
  }

  /**
   * Get User Roles
   */
  public getUserRoles(): Observable<any> {
    this.http.get(
        environment.graphqlApiGateway + '/users/getUserRoles')
        .subscribe((res: Array<any>) => {
          const roles = res.map(obj => new Role(obj));
          this.rolesListSubject.next(roles);
    })

    return this.rolesListSubject.asObservable();
  }

  /**
   * Get Teachers
   */
  public getTeachers(): Observable<any> {
    this.http.get(environment.graphqlApiGateway + '/users/getTeachers')
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
        environment.graphqlApiGateway + '/users/updateUserPassword', { newPassword: password, userName: username} );
  }

  /**
   * TODO: Basic Auth
   */
}
