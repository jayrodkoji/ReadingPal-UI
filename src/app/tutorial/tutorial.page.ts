import { Component, OnInit } from '@angular/core';
import { TEACHERS, STUDENTS } from './data/users';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage implements OnInit {
  currentTeacher: any;
  currentStudent: any;
  teachers: any = TEACHERS;
  students: any = STUDENTS;
  currentUser: any;

  constructor() { }

  ngOnInit() {
  }
}
