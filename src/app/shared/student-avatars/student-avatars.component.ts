import { Component, Input, OnInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

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
  }[] = [];

  constructor() {}

  ngOnInit() {
    if (!this.slideOptions){
      this.slideOptions = null;
    }

    this.getUsers();
  }

  getUsers() {
  }

}
