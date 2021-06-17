import { Component, OnDestroy, OnInit } from '@angular/core';
import { StudentService } from '../../Providers/student-controller/student.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import {BadgeControllerService} from '../../Providers/badges/badge-controller.service';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent implements OnInit {
  student_avatar;
  dynamicStyle;
  badges: any[];
  subscription;
  userRole: any;
  firstName: any;

  data: any
  constructor(
    private dataService: StudentService,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private router: Router,
    private badgeController: BadgeControllerService) { }


  ngOnInit() {
    const username = localStorage.getItem('logedInUsername');
    this.http.get(
      environment.gatewayBaseUrl + '/users/getUser?username=' + username).subscribe(data => {
        this.userRole = data['roles'][0].type;
        this.firstName = data['firstName'];

        if (data !== null && data['profileimage'] !== null) {
          this.student_avatar = 'data:image/png;base64,'
            + (this.sanitizer.bypassSecurityTrustResourceUrl(data['profileimage']) as any).changingThisBreaksApplicationSecurity;
        }
        else {
          this.student_avatar =
            '../../assets/user.png';
        }

        if (data !== null && data['backgroundimage'] !== null) {
          this.dynamicStyle = 'data:image/png;base64,'
            + (this.sanitizer.bypassSecurityTrustResourceUrl(data['backgroundimage']) as any).changingThisBreaksApplicationSecurity;
        } else {
          this.dynamicStyle = 'url(../../../assets/Banner.jpg)';
        }
      });

    this.badgeController.getUsersBadges(username)
      .subscribe(res => {
        this.badges = res;
      });
  }
}
