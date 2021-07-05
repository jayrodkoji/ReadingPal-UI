import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DictionaryControllerService {

  private static makeUrl(word: string): string {
    // return 'https://www.dictionaryapi.com/api/v3/references/collegiate/json/' +
    //  encodeURIComponent(word);
    return 'https://www.dictionaryapi.com/api/v3/references/sd4/json/' +
      encodeURIComponent(word);
  }

  private static getKey(): string {
    // return '78c6d2e2-c6e5-4a2f-85a1-8beb042a221a';
    return 'ae62c75a-c9b6-417a-bcf5-53260ded152f';
  }

  constructor(private httpClient: HttpClient) { }

  lookupWord(word: string): Observable<any> {
    const params = new HttpParams().set('key', DictionaryControllerService.getKey());
    return this.httpClient.get(
      DictionaryControllerService.makeUrl(word), {params}
    );
  }
}
