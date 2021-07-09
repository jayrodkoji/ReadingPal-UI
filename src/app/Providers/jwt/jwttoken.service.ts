/**
 * From https://www.syncfusion.com/blogs/post/best-practices-for-jwt-authentication-in-angular-apps.aspx
 * With edits by: Jared Knight 
 * Last edited: July 9th, 2021
 */

import { Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage/local-storage.service';
import jwt_decode from 'jwt-decode';

@Injectable()
export class JWTTokenService {

  decodedToken: { [key: string]: string };

  constructor(
    private localStorageService: LocalStorageService
  ) { }

  decodeToken() {
    if (this.localStorageService.get('token')) {
      this.decodedToken = jwt_decode(this.localStorageService.get('token'));
    }
  }

  getDecodeToken() {
    this.decodeToken();
    return this.decodeToken;
  }

  getRoles() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken.roles : null;
  }

  getExpiryTime() {
    this.decodeToken();
    return this.decodedToken ? this.decodedToken.exp : null;
  }

  isTokenExpired(): boolean {
    const expiryTime: number = Number(this.getExpiryTime());
    if (expiryTime) {
      return ((1000 * expiryTime) - (new Date()).getTime()) < 5000;
    } else {
      return false;
    }
  }
}