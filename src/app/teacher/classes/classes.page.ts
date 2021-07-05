import { Component, OnInit } from '@angular/core';
import { LessonData } from 'src/app/Providers/lesson-services/lesson-services-models/lesson-data';
import { BookInfo } from 'src/app/model/book-info';
import { BadgeData } from 'src/app/Providers/badges/badge-data';
import {ClassArray, ClassData} from 'src/app/Providers/class-controller/class-data';
import { CompletedLessonArray } from 'src/app/Providers/completed-lesson/Model/completed-lesson';
import { ClassControllerService } from 'src/app/Providers/class-controller/class-controller.service';
import {GroupControllerService} from '../../Providers/group-controller/group-controller.service';
import {BehaviorSubject, forkJoin} from 'rxjs';
import {UsersService} from '../../Providers/user-controller/users.service';
import { User } from 'src/app/Providers/user-controller/model/users-model';

export class FullLessonData {
  lessonData: LessonData;
  bookData: BookInfo;
  badgeData: BadgeData;
}

export class FullClassData {
  classData: ClassData;
  studentData: CompletedLessonArray;
  students: any[];
}

@Component({
  selector: 'app-class',
  templateUrl: './classes.page.html',
  styleUrls: ['./classes.page.scss'],
})
export class ClassesPage implements OnInit {
  teacher: string;
  currentTab = 'classes';
  isReport = false;
  allReadingGroups;
  users: User[] = [];

  classes: ClassData[];

  constructor(
      private ClassController: ClassControllerService,
      private groupController: GroupControllerService,
      private userController: UsersService
  ) { }

  ngOnInit() {
    this.teacher = localStorage.getItem('logedInUsername');
    this.getClasses();
    // this.chartTester();
  }

  /**
   * API call to get all classes for teacher
   */
  getClasses() {
    this.ClassController.getClassesWithTeacherName({uName: this.teacher})
      .subscribe((result: ClassArray) => {
        if (result) {
          this.classes = result;

          this.classes.forEach(clss => {
            clss.students.forEach(st => {
              this.users.push(st);
            });
          });

          this.users = this.users.filter((st, index, self) =>
              index === self.findIndex((t) => (
                  t._id === st._id
              )));

          this.users.forEach(usr => {
            const user = this.userController.getUser(usr.username);
            if ( user ) {
              usr = user;
            }
          });

          this.getReadingGroups();
        }
      });
  }

  getReadingGroups() {
    this.allReadingGroups = [];
    this.classes.forEach(clss => {
      this.groupController.getGroupsByClassId(clss.id).subscribe(groups => {
        if (groups) {
          this.allReadingGroups = this.allReadingGroups.concat(groups);
          forkJoin(this.allReadingGroups.map(
              g => {
                const subject = new BehaviorSubject(null);
                this.groupController.getStudentsInGroup(g.id)
                    .subscribe(arr => {
                      g.students = arr;

                      const newStudents = [];

                      g.students.forEach(st => {
                        this.users.forEach((us: any) => {
                          if (us.id == st) {
                            newStudents.push(us);
                          }
                        });
                      });
                      g.students = newStudents;
                      subject.complete();
                    });
                return subject.asObservable();
              }
          ));
        }
      });
    });
  }

  chartTester() {
    const Chart = require('chart.js');
    const ctx = document.getElementById('myChart');
    const readingChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['totalTimeSpentReading', 'totalWordsRead', 'totalWordsRead80Plus'],
        datasets: [{
          label: 'Reading Data',
          // data: [this.studentData.totalTimeSpentReading, this.studentData.totalWordsRead, this.studentData.totalWordsRead80Plus],
          data: [20, 50, 30],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }
}
