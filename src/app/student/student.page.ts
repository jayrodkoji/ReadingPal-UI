import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { MessagesService } from '../Providers/messages-controller/messages.service';


@Component({
  selector: 'app-student',
  templateUrl: './student.page.html',
  styleUrls: ['./student.page.scss'],
})
export class StudentPage implements OnInit {
  public studentPages = [
    { title: 'home', url: '/student/home' },
    { title: 'badges', url: '/student/badges' },
    { title: 'grades', url: '/student/reports' },
    // { title: 'lessons', url: '/student/lessons' },
    { title: 'library', url: '/student/library' },
    { title: 'messages', url: '/student/messages' },
  ];

  public selectedTitle: string;
  public numUnread = 0;

  constructor(
    private menu: MenuController,
    private router: Router,
    private msgController: MessagesService,
  ) { }

  ngOnInit() {
    this.getMessages();

    // check for new messages every 5 minutes
    setInterval(() => { this.getMessages(); }, 300000);
  }

  openCustom() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  updateSelection(pageName: string) {
    this.selectedTitle = pageName;
  }

  logOut() {
    // this.accountServices.logout();
    localStorage.removeItem('logedInUsername');
    localStorage.removeItem('logedInRole');
    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });
  }

  getMessages() {
    this.msgController.getStudentsMessages(localStorage.getItem('logedInUsername'))
      .subscribe((res) => {
        if (res) {
          this.numUnread = Array.from(new Set(res.sort((a, b) => b.time_stamp - a.time_stamp).map(a => a.annotation_id)))
            .map(annotation_id => {
              return res.find(a => a.annotation_id === annotation_id);
            }).filter((obj) => obj.student_read == false).length;
        }
      });
  }
}
