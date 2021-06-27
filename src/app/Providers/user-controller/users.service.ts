import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { NewUser, UpdateUser, User } from "./model/users-model";
import { Apollo, gql } from 'apollo-angular';
import { subscribe, __Directive } from 'graphql';
import { error } from 'console';

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
  public addUser(user: NewUser): Observable<any> {
    const ADD_USER = gql`
      mutation addUser($newUser: NewUser) {
        addUser(newUser: $newUser) {
          _id
          firstName
          lastName
          username
          email
        }
      }
    `;

    return new Observable(subscriber => {
      this.apollo.mutate({
        mutation: ADD_USER,
        variables: {
          newUser: user
        }
      }).subscribe((res: any) => {
        if (res?.data?.addUser) {
          let users = this.users$.getValue();
          users.push(res.data.addUser)
          this.users$.next(users)
          subscriber.next({ success: true })
        } else {
          subscriber.next({ success: true })
        }
      }, _ => { subscriber.next({ success: false }) })
    })
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
        let users = data.users.map(user => new User(user));
        this.users$.next(users)
      });

    return this.users$.asObservable();
  }

  /**
   * Get User
   */
  public getUser(query: any): User {
    this.apollo.watchQuery<any>({
      query: query
    })
      .valueChanges
      .subscribe(({ data }) => {
        return data
      });

    return null
  }

  /**
   * Update User
   */
  public updateUser(_id: string, userUpdate: UpdateUser): Observable<any> {
    const Update_User = gql`
      mutation updateUser($_id: String!, $userUpdate: UserUpdate) {
        updateUser(_id: $_id, userUpdate: $userUpdate) {
          success
        }
      }
    `;

    return new Observable(subscriber => {
      this.apollo.mutate({
        mutation: Update_User,
        variables: {
          _id: _id,
          userUpdate: userUpdate
        }
      }).subscribe((res: any) => {
        if (res?.data?.updateUser?.success) {
          let user: User = Object.assign(this.users$.getValue().filter(usr => _id === usr._id)[0], userUpdate)
          let allUsers = this.users$.getValue().filter(usr => _id !== usr._id);
          allUsers.push(user)
          subscriber.next({ success: true })
        } else {
          subscriber.next({ success: false })
        }
      }, _ => { subscriber.next({ success: false }) })
    })
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
      if (res?.data?.deleteUser?.success) {
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
      environment.graphqlApiGateway + '/users/updateUserPassword', { newPassword: password, userName: username });
  }
}
