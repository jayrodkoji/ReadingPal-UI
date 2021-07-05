import { Component, OnInit } from '@angular/core';
import { TEACHERS, STUDENTS } from './data/users';
import {first} from 'rxjs/operators';
import {AccountServices} from '../Providers/account/account.services';
import {Router} from '@angular/router';

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

  constructor(
  private accountServices: AccountServices,
  private router: Router
  ) { }

  ngOnInit() {
  }

  login() {
    this.accountServices.login(this.currentUser.username, this.currentUser.password)
        .pipe(first())
        .subscribe(
            data => {
              localStorage.setItem('logedInUsername', data.username);
              localStorage.setItem('logedInRole', data.role);

              if (data.role === 'ROLE_TEACHER') {
                this.router.navigate(['../teacher'], { replaceUrl: true });
              } else if (data.role === 'ROLE_STUDENT') {
                this.router.navigate(['../student'], { replaceUrl: true });
              } else if (data.role === 'ROLE_ADMIN') {
                this.router.navigate(['../admin'], { replaceUrl: true });
              } else {
                this.router.navigate(['/home']);
              }
            },
            error => {
              console.log(error);
            });
  }
}
