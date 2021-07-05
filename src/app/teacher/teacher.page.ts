import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.page.html',
  styleUrls: ['./teacher.page.scss'],
})
export class TeacherPage implements OnInit {
  allusers: any;
  allroles: any;
  public selectedTitle: string;

  teacherPages = [
    {
      title: 'classes',
      url: '/teacher/classes'
    },
    {
      title: 'lessons',
      url: '/teacher/lessons'
    },
    {
      title: 'books',
      url: '/teacher/books'
    },
    {
      title: 'awards',
      url: '/teacher/awards'
    },
    {
      title: 'messages',
      url: '/teacher/messages'
    }
  ];


  constructor(
    private menu: MenuController,
    private router: Router,
) { }

  ngOnInit() {}

  openCustom() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  updateSelection(pageName: string) {
    this.selectedTitle = pageName;
  }
}
