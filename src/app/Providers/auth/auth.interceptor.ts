/**
 * Based on: https://blog.angular-university.io/angular-jwt-authentication/
 * Edited by: Jared Knight
 */

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LocalStorageService } from "../local-storage/local-storage.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private localStorageService: LocalStorageService
  ) { }

  intercept(req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.localStorageService.get("token");

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set("Authorization",
          "Bearer " + token)
      });

      return next.handle(cloned);
    }
    else {
      return next.handle(req);
    }
  }
}