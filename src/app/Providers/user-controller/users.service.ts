import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { User } from "./model/users-model";
import { Apollo, gql } from 'apollo-angular';
import { __Directive } from 'graphql';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private teachersListSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(null);
  private users$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(null);
  User
  loading: boolean;

  constructor(
      private http: HttpClient,
      private apollo: Apollo
  ) { }

  /**
   * Create User
   */
  public addUser(data: User): Observable<any> {
    return this.http.post(
        environment.graphqlApiGateway + '/users', data)
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
        this.users$.next(data.users)
      });

    return this.users$.asObservable();
  }

  /**
   * Get User
   */
  public getUser(query: any) {
    this.apollo.watchQuery<any>({
      query: query
    })
      .valueChanges
      .subscribe(({ data }) => {
        return data
      });
  }

  /**
   * Update User
   */
  //TODO: update to return new list of users
  public updateUser(_id: String, userUpdate: User): Observable<any> {
    const Update_User = gql`
      mutation updateUser($_id: String!, $userUpdate: UserUpdate) {
        updateUser(_id: $_id, userUpdate: $userUpdate) {
          success
        }
      }
    `;

    this.apollo.mutate({
      mutation: Update_User,
      variables: {
        _id: _id,
        userUpdate: userUpdate
      }
    }).subscribe((res: any) => {
      if(res?.data?.update?.success){
       console.log('success')
      }
    })

    return this.users$.asObservable();
  }

  /**
   * Delete User
   */
  public deleteUser(_id: string): Observable<any> {
    const DELETE_USER = gql`
      mutation DeleteUser($_id: String!) {
        deleteUser(_id: $_id) {
          success
        }
      }
    `;

    this.apollo.mutate({
      mutation: DELETE_USER,
      variables: {
        _id: _id
      }
    }).subscribe((res: any) => {
      if(res?.data?.deleteUser?.success){
        this.users$.next(
          this.users$.getValue().filter(user => user._id !== _id)
        )
      }
    })

    return this.users$.asObservable();
  }


  /**
   * Get Teachers
   */
  public getTeachers(): Observable<any> {
    this.http.get(environment.graphqlApiGateway + '/users/getTeachers')
        .subscribe((res: Array<any>) => {
          const teachers = res.map(obj => new User(obj));
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
