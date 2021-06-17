import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CompletedLessonData } from 'src/app/Providers/completed-lesson/Model/completed-lesson';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CompletedLessonService } from 'src/app/Providers/completed-lesson/completed-lesson.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ExperienceControllerService } from 'src/app/Providers/experience-controller/experience-controller.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements AfterViewInit {

  studentData: CompletedLessonData;
  studentExpLevel: any;
  studentUsername: string;


  constructor(private router: Router, private http: HttpClient, private completedLessonController: CompletedLessonService, private experienceController: ExperienceControllerService) { }

  ngAfterViewInit() {
    this.getStudentData();

  }

  getStudentData() {
    const username = localStorage.getItem('logedInUsername');
    this.http.get(
      environment.gatewayBaseUrl + '/students/student-info?studentUserName=' + username).subscribe((res) => {
        this.completedLessonController.getStatsForStudent({ 'id': res['id'] }).subscribe((statsRes) => {
          if (statsRes !== null) {

            this.experienceController.getUserPoints(username).subscribe((expResult) => {
              if (expResult !== null) {
                this.studentExpLevel = expResult;
              }
              this.studentData = statsRes;
              this.studentUsername = this.studentData.userName;
              this.chartBuilder();
            });
          }
        });
      });
  }

  chartBuilder() {
    var Chart = require('chart.js');

    var ctx = document.getElementById('lessonsChart');



    var lessonChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Reading Lessons Scored Above 80%',
            data: [this.studentData.readingLessons80Plus],
            backgroundColor: ['rgba(44, 130, 201, 1)'],
            borderColor: [],
            borderWidth: 1
          },
          {
            label: 'Total Reading Lessons Taken',
            data: [this.studentData.readingLessons],
            backgroundColor: ['rgba(255, 99, 132, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)'],
            borderWidth: 1
          }
        ]
      },
      responsive: true,
      options: {
        scales: {
          xAxes: [{
            stacked: true,
            ticks: {
              beginAtZero: true
            }
          }],
          yAxes: [{
            stacked: true,
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });


    var ctx = document.getElementById('readingsChart');
    var readingChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Words Read Scored Above 80%',
            data: [this.studentData.totalWordsRead80Plus],
            backgroundColor: ['rgba(44, 130, 201, 1)'],
            borderColor: [],
            borderWidth: 1
          },
          {
            label: 'Total Words Read',
            data: [this.studentData.totalWordsRead],
            backgroundColor: ['rgba(255, 99, 132, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)'],
            borderWidth: 1
          }
        ]
      },
      responsive: true,
      options: {
        scales: {
          xAxes: [{
            stacked: true,
            ticks: {
              beginAtZero: true
            }
          }],
          yAxes: [{
            stacked: true,
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });


  }


  printReport() {
    const printContent = document.getElementById("ReportCard");
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write('<link rel="stylesheet" type="text/scss" href="classes-card.page.scss">');
    WindowPrt.document.write(printContent.innerHTML);

    var canvas = document.getElementById("lessonsChart") as HTMLCanvasElement;

    WindowPrt.document.write('<br><img style="width: 100%;" src="' + canvas.toDataURL() + '"/>');

    canvas = document.getElementById("readingsChart") as HTMLCanvasElement;

    WindowPrt.document.write('<br><img style="width: 100%;" src="' + canvas.toDataURL() + '"/>');

    WindowPrt.document.close();

    WindowPrt.focus();
    WindowPrt.print();

  }

}