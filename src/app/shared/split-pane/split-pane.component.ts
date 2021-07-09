import { Component, Input, OnInit, Inject } from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {MessagesService} from '../../Providers/messages-controller/messages.service';
import { AuthService } from 'src/app/Providers/auth/auth.services';

@Component({
  selector: 'app-split-pane',
  templateUrl: './split-pane.component.html',
  styleUrls: ['./split-pane.component.scss'],
})
export class SplitPaneComponent implements OnInit {
  @Input() pages = [];
  public selectedTitle: string;
  numUnread: any = 0;


  constructor(
    private router: Router,
    private msgController: MessagesService,
    private authService: AuthService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    // set selected page
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd){
        this.setTab();
      }
    });

    // this.getMessages();

    // check for new messages every 5 minutes
    // setInterval(() => { this.getMessages(); }, 300000);
  }

  updateSelection(pageName: string) {
    this.selectedTitle = pageName;
  }

  setTab() {
    // make sure we are still in main category
    const urlArr = this.router.url.split('/');
    this.selectedTitle = urlArr[2];
  }

  getMessages() {
    this.msgController.getTeachersMessages(localStorage.getItem('logedInUsername'))
      .subscribe((res) => {
        if (res){
          this.numUnread = Array.from(new Set(res.sort((a, b) => b.time_stamp - a.time_stamp).map(a => a.annotation_id)))
              .map(annotationId => {
                return res.find(a => a.annotation_id === annotationId);
              }).filter((obj) => obj.teacher_read === false).length;
        }
      });
  }

  logOut() {
    this.authService.logout();
  }
}
