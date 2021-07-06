import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { User } from '../user-controller/model/users-model';

@Injectable({
  providedIn: 'root'
})
export class AccountServices {
  private baseUrl: string = environment.graphqlApiGateway;
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
      this.userSubject = new BehaviorSubject<User>(null);
      this.user = this.userSubject.asObservable();
  }

  login(username: string, password: string) {
    return this.http.get(this.baseUrl + '/users/basicauth',
    { headers: { authorization: 'Basic ' + window.btoa(username  + ':' + password) }})
    .pipe(
      map((user: any) => {
        // get user from response
        const role = user.principal.userRoles[0];
        user = user.principal.user;
        user.role = role;
        this.userSubject.next(user);
        return user;
      })
    );
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  // TODO: Shem
  sigup() {

  }
}

