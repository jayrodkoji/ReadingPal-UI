import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExperienceControllerService {
  constructor(private http: HttpClient) { }

  private static buildUrl(suffix: string) {
    return environment.gatewayBaseUrl + '/experience/' + suffix;
  }

  getUserPoints(username: string) {
    const params = new HttpParams()
      .set('username', username);
    return this.http.get(
      ExperienceControllerService.buildUrl('get-user-points'), {params});
  }

  increaseUserPoints(username: string, amount: number) {
    const params = new HttpParams()
      .set('username', username)
      .set('amount_to_add', amount.toString());
    return this.http.get(
      ExperienceControllerService.buildUrl('increase-user-points'), {params});
  }
}
