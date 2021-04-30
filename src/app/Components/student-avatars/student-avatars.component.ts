import { Component, Input, OnInit } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-student-avatars',
  templateUrl: './student-avatars.component.html',
  styleUrls: ['./student-avatars.component.scss'],
})
export class StudentAvatarsComponent implements OnInit {
  @Input() slideOptions: any;
  @Input() students: [];
  users: {
    username: string;
    image: string;
  }[] = []

  constructor(
      private sanitizer: DomSanitizer,
      private http: HttpClient
  ) {}

  ngOnInit() {
    if(!this.slideOptions){
      this.slideOptions = null
    }

    this.getUsers();
  }

  getUsers() {
    for (let student of this.students) {
      this.http.get(
          environment.gatewayBaseUrl + '/users/getUser?username=' + student['username']).subscribe(data => {

        let image = data['profileimage'] ? 'data:image/png;base64,'
            + (this.sanitizer.bypassSecurityTrustResourceUrl(data['profileimage']) as any).changingThisBreaksApplicationSecurity
            : '../../assets/user.png';

        this.users.push({username: data['username'], image});
      });
    }
  }

}
