import { Component, OnInit } from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import { MenuController } from '@ionic/angular';
import {MessagesService} from "../Providers/messages-controller/messages.service";


@Component({
  selector: 'app-student',
  templateUrl: './student.page.html',
  styleUrls: ['./student.page.scss'],
})
export class StudentPage implements OnInit {
  public studentPages = [
      { title: 'Home', url: 'home'},
      { title: 'Lessons', url: 'lesson'},
      { title: 'Library', url: 'library'},
      { title: 'Reports', url: 'reports'},
      { title: 'Messages', url: 'messages'},
      { title: 'Badges', url: 'badges'},
      { title: 'Games', url: 'game'}
    ];
  public selectedTitle: string;
  public numUnread: number = 0;

  constructor(
    private menu: MenuController,
    private router: Router,
    private msgController: MessagesService,
    ) { }
  
  ngOnInit(){

    const uRole = localStorage.getItem('logedInRole');
    if (uRole !== 'ROLE_STUDENT') {
      this.router.navigate(['../bad-login'], { replaceUrl: true });
    }

    // set selected page
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd){
        this.setTab();
      }
    })

    this.getMessages();

    // check for new messages every 5 minutes
    setInterval(() => { this.getMessages() }, 300000);
  }

  openCustom() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  updateSelection (pageName: string) {
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

  setTab() {
    // make sure we are still in main category
    let urlArr = this.router.url.split('/');
    console.log(urlArr)
    this.selectedTitle = urlArr[2];
  }

  getMessages() {
    this.msgController.getStudentsMessages(localStorage.getItem('logedInUsername'))
        .subscribe((res) => {
          if(res){
            this.numUnread = Array.from(new Set(res.sort((a,b) => b.time_stamp-a.time_stamp).map(a => a.annotation_id)))
                .map(annotation_id => {
                  return res.find(a => a.annotation_id === annotation_id)
                }).filter((obj) => obj.student_read == false).length;
          }
        })
  }
}
