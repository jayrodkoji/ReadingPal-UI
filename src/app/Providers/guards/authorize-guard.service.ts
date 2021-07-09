import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { JWTTokenService } from '../jwt/jwttoken.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeGuard implements CanActivate {
  constructor(
    private jwtService: JWTTokenService,
    private router: Router
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<any> | Promise<any> | boolean {
    if (this.checkUserRole(next)) {
      if (this.jwtService.isTokenExpired()) {
        this.router.navigate(['/home']);
      } else {
        return true;
      }
    }
  }

  checkUserRole(route: ActivatedRouteSnapshot): boolean {
    const userRoles = this.jwtService.getRoles()
    if (route.data.role && !userRoles.includes(route.data.role)) {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }
}
