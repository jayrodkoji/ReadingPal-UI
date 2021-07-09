import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { User } from '../user-controller/model/users-model';

@Injectable({
  providedIn: 'root'
})
export class AccountServices {
  private authURL: string = environment.authServer;
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
    this.userSubject = new BehaviorSubject<User>(null);
    this.user = this.userSubject.asObservable();
  }

  login(email: string, password: string) {
    return this.http.post(this.authURL + '/login', {},
      {
        headers: new HttpHeaders().set('authorization', 'Basic ' + window.btoa(email + ':' + password))
      })
      .pipe(
        map((user: User) => {
          // get user from response
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
}

