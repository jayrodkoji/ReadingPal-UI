import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authURL: string = environment.authServer;

  constructor(
    private localStorageService: LocalStorageService,
    private http: HttpClient,
    private router: Router,
  ) { }

  login(email: string, password: string) {
    return this.http.post(this.authURL + '/login', {},
      {
        headers: new HttpHeaders().set('authorization', 'Basic ' + window.btoa(email + ':' + password))
      })
      .pipe(
        map((token: string) => {
          if(token){
            this.localStorageService.set('token', token)
          }
        })
      );
  }

  logout() {
    this.localStorageService.remove('token');
    this.router.navigate(['/home']);
  }

  getJWTToken() {
    return this.localStorageService.get('token');
  }
}

