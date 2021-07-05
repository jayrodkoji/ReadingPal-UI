import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Score, ScoreArray } from './lesson-models/score';

@Injectable({
  providedIn: 'root'
})
export class VocabularyServicesService {
  vocabSubject: BehaviorSubject<string[]>;
  scoresSubject: BehaviorSubject<ScoreArray>;

  constructor(private http: HttpClient) { }


  /**
   * Add scores
   */
  public addScore(data: string[]): Observable<any> {
    if (!this.scoresSubject) {
      this.scoresSubject = new BehaviorSubject<ScoreArray>([]);
    }

    const username = localStorage.getItem('logedInUsername');
    const params = new HttpParams().set('username', username);

    console.log(data);
    this.http.post(
      environment.gatewayBaseUrl + '/vocabulary/add-scores',
      data,
      { params }).subscribe((res: Array<any>) => {
        const scores = res.map(obj => new Score(obj));
        this.scoresSubject.next(scores);
      });

    return this.scoresSubject.asObservable();
  }


  /**
   * Add vocabulary
   * @param data list of words in string form
   */
  public addVocabulary(lessonId: string, data: string[]): Observable<any> {
    if (!this.vocabSubject) {
      this.vocabSubject = new BehaviorSubject<string[]>(null);
    }

    const params = new HttpParams().set('lessonId', lessonId);

    this.http.post(
      environment.gatewayBaseUrl + '/vocabulary/add-vocab',
      data,
      { params }).subscribe((result: Array<any>) => {
      this.vocabSubject.next(result);
    });

    return this.vocabSubject.asObservable();
  }

  /**
   * Decrement scores
   */
  public decrementScore(username: string, vocabularyScoreId: string): Observable<any> {
    const params = new HttpParams()
      .set('username', username)
      .set('vocabularyScoreId', vocabularyScoreId);

    return this.http.post(
      environment.gatewayBaseUrl + '/vocabulary/decrement-scores',
      { params });
  }

  /**
   * Decrement scores
   */
  public incrementScore(username: string, vocabularyScoreId: string): Observable<any> {
    const params = new HttpParams()
      .set('username', username)
      .set('vocabularyScoreId', vocabularyScoreId);

    return this.http.post(
      environment.gatewayBaseUrl + '/vocabulary/increment-scores',
      { params });
  }

  /**
   * Get scores
   */
  public getScores(username: string): Observable<any> {
    if (!this.scoresSubject) {
      this.scoresSubject = new BehaviorSubject<ScoreArray>([]);
    }

    const params = new HttpParams().set('username', username);

    this.http.get(
      environment.gatewayBaseUrl + '/vocabulary/get-scores',
      { params }).subscribe((res: Array<any>) => {
        const scores = res.map(obj => new Score(obj));
        this.scoresSubject.next(scores);
      });

    return this.scoresSubject.asObservable();
  }

  /**
   * Get vocabulary
   */
  public getVocab(lessonId: string): Observable<any> {
    if (!this.vocabSubject) {
      this.vocabSubject = new BehaviorSubject<string[]>([]);
    }

    const params = new HttpParams().set('lessonId', lessonId);

    this.http.get(
      environment.gatewayBaseUrl + '/vocabulary/get-vocab',
      { params }).subscribe((res: Array<any>) => {
        this.vocabSubject.next(res);
      });

    return this.vocabSubject.asObservable();
  }

  public getVocabDirect(lessonId: string) {
    const params = new HttpParams().set('lessonId', lessonId);
    return this.http.get(
      environment.gatewayBaseUrl + '/vocabulary/get-vocab',
      { params }) as Observable<string[]>;
  }

}
