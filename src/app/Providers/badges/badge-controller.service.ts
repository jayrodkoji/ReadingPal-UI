import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {BadgeData, BadgeIcon} from './badge-data';
import {ImageUtils} from '../../rp-utils/image-utils';
import {LessonPostData} from "../lesson-services/lesson-services-models/lesson-post-data";
import {LessonArray, LessonData} from "../lesson-services/lesson-services-models/lesson-data";

@Injectable({
  providedIn: 'root'
})
export class BadgeControllerService {
  private badgeIconsSubject: BehaviorSubject<BadgeIcon[]> = new BehaviorSubject<BadgeIcon[]>(null);
  private badgeDataSubject: BehaviorSubject<BadgeData[]> = new BehaviorSubject<BadgeData[]>(null);
  private UsersbadgeDataSubject: BehaviorSubject<BadgeData[]> = new BehaviorSubject<BadgeData[]>(null);
  private CreatorsbadgeDataSubject: BehaviorSubject<BadgeData[]> = new BehaviorSubject<BadgeData[]>(null);
  private rPBadgeDataSubject: BehaviorSubject<BadgeData[]> = new BehaviorSubject<BadgeData[]>(null);

  constructor(
    private http: HttpClient
  ){}

    /**
     * Add Badge Icon
     */
    public addBadgeIcon(data: BadgeData): Observable<any> {
        const username = localStorage.getItem('logedInUsername');
        const params = new HttpParams().set('username', username);

        console.log(data)

        this.http.post(
            environment.gatewayBaseUrl + '/badges/add-badge-icon',
            data,
            { params }).subscribe(res => {
                this.badgeDataSubject.getValue().push(new BadgeData(res));
                this.badgeDataSubject.next(this.badgeDataSubject.getValue());

                this.CreatorsbadgeDataSubject.getValue().push(new BadgeData(res))
                this.CreatorsbadgeDataSubject.next(this.CreatorsbadgeDataSubject.getValue())
            });

        return this.badgeDataSubject.asObservable();
    }

    /**
     * Delete badge icon
     * @param badgeId: badge id
     */
    public deleteBadgeIcon(badgeId: string): Observable<any> {
        const params = new HttpParams()
            .set('id', badgeId);

        return this.http.delete(
            environment.gatewayBaseUrl + '/badges/delete-badge-icon',
            { params }
        )
    }

    /**
     * get Badge by badgeId
     * @param badgeId: badge id
     */
    public getBadgeById(badgeId: string): Observable<any> {
        const params = new HttpParams()
            .set('badge_id', badgeId);

        return this.http.get(
            environment.gatewayBaseUrl + '/badges/get-badge-by-id',
            { params });
    }

    /**
     * get all Badges
     */
    public getBadges(): Observable<any> {
        this.http.get(
            environment.gatewayBaseUrl + '/badges/get-badges')
            .subscribe((res: Array<any>) => {
                const badge = res.map(obj => new BadgeData(obj));
                this.badgeDataSubject.next(badge);
            });

        return this.badgeDataSubject.asObservable();
    }

    /**
     * gets users Badges
     * TODO: this may need additional security
     */
    public getUsersBadges(username: string): Observable<any> {
        const params = new HttpParams().set('username', username);

        console.log(username)
        this.http.get(
            environment.gatewayBaseUrl + '/badges/get-users-badges',
            { params })
            .subscribe((res: Array<any>) => {
                console.log(res)
                const badge = res.map(obj => new BadgeData(obj));
                this.UsersbadgeDataSubject.next(badge);
            });

        return this.UsersbadgeDataSubject.asObservable();
    }

    /**
     * gets creators Badges
     *
     */
    public getCreatorsBadges(username: string): Observable<any> {
        const params = new HttpParams().set('username', username);

        this.http.get(
            environment.gatewayBaseUrl + '/badges/get-creators-badges',
            { params })
            .subscribe((res: Array<any>) => {
                const badge = res.map(obj => new BadgeData(obj));
                this.CreatorsbadgeDataSubject.next(badge);
            });

        return this.CreatorsbadgeDataSubject.asObservable();
    }

    /**
     * gets Reading Pal Created Badges
     *
     */
    public getRPBadges(): Observable<any> {
        const params = new HttpParams().set('username', 'readingPal');

        this.http.get(
            environment.gatewayBaseUrl + '/badges/get-creators-badges',
            { params })
            .subscribe((res: Array<any>) => {
                const badge = res.map(obj => new BadgeData(obj));
                this.rPBadgeDataSubject.next(badge);
            });

        return this.rPBadgeDataSubject.asObservable();
    }

    /**
     * give Badge
     * @param badgeId: id of badge to be given
     * @param username: user to receive badge
     */
    public giveBadge(badgeId: string, username: string): Observable<any> {
        const params = new HttpParams()
            .set('badgeId', badgeId)
            .set('username', username);

        return this.http.post(
            environment.gatewayBaseUrl + '/badges/give-badge',
            { params });
    }

    /**
     * Take badge from user
     * @param badgeId: id of badge to be given
     * @param username: user to receive badge
     */
    public takeBadge(badgeId: string, username: string): Observable<any> {
        const params = new HttpParams()
            .set('badgeId', badgeId)
            .set('username', username);

        return this.http.delete(
            environment.gatewayBaseUrl + '/badges/take-badge',
            { params }
        )
    }

  public getBadgeIcons(): Observable<BadgeIcon[]> {
    return this.badgeIconsSubject.asObservable();
  }

  public getBadgeDataList(): Observable<BadgeData[]> {
    return this.badgeDataSubject.asObservable();
  }

  public create(
    badgeName: string,
    badgeDescription: string,
    badgeIcon: string) {

    return this.addBadgeIcon(new BadgeData({
        icon: badgeIcon,
        name: badgeName,
        description: badgeDescription
    }))
  }

  public createWithFilename(
    badgeName: string,
    badgeDescription: string,
    filename: string) {
    this.serverIconSubscribe(filename,
      (result: string) => {
        this.create(
          badgeName,
          badgeDescription,
          result);
      });
  }

  public serverIconSubscribe(filename: string, func) {
    this.http.get(filename, { responseType: 'blob' })
      .subscribe(
        result => {
          const reader = new FileReader();
          reader.onloadend = () => {
            func(reader.result);
          };
          reader.readAsBinaryString(result);
        }
      );
  }

  private initializeBadgeIconsService(username: string) {
    // TODO: Uncomment server code
    fetch(
      './assets/sample-json/badge-icons-sample.json')
      .then(result => result.json())
      .then(
        (result: any[]) => {
          const temp = result.map(obj => new BadgeIcon(obj));
          for (let i = 0; i < 7; i++)
          {
            temp.push(temp[0]);
          }
          this.badgeIconsSubject.next(temp);
        }
      );
    /*const params = new HttpParams().set('username', username);
    this.http.get(
      environment.gatewayBaseUrl + '/badges/get-badge-icons',
      {params})
      .subscribe(
        (result: any[]) => {
          this.badgeIconsSubject.next(result.map(obj => new BadgeIcon(obj)));
        }
      );*/
  }

  // private initializeBadgeDataService(username: string) {
  //   /*fetch(
  //     './assets/sample-json/badges-sample.json')
  //     .then(result => result.json())
  //     .then(
  //       (result: any[]) => {
  //         const temp = result.map(obj => new BadgeData(obj));
  //         for (let i = 0; i < 7; i++)
  //         {
  //           temp.push(temp[0]);
  //         }
  //         this.badgeDataSubject.next(temp);
  //       }
  //     );*/
  //   const params = new HttpParams().set('username', username);
  //   this.http.get(
  //     environment.gatewayBaseUrl + '/badges/get-badges',
  //     {params})
  //     .subscribe(
  //       (result: any[]) => {
  //         this.badgeDataSubject.next(result.map(obj => new BadgeData(obj)));
  //       }
  //     );
  // }
}
