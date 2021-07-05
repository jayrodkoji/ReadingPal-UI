import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FullLessonData } from '../classes.page';
import { LessonService } from '../../../Providers/lesson-services/lesson.service';
import { GetBooksService } from '../../../Providers/books/get-books.service';
import { CompletedLessonService } from '../../../Providers/completed-lesson/completed-lesson.service';
import { CompletedLessonArray } from '../../../Providers/completed-lesson/Model/completed-lesson';
import { ClassData } from '../../../Providers/class-controller/class-data';
import { environment } from 'src/environments/environment';
import { ClassControllerService } from 'src/app/Providers/class-controller/class-controller.service';

import { ChartDataSets, ChartOptions, ChartType, RadialChartOptions } from 'chart.js';
import { Color, MultiDataSet, SingleDataSet, Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

export class ClassStats {
  clss: ClassData;
  studentStats: CompletedLessonArray;
}
export class FullClassData {
  classData: ClassData;
  studentData: CompletedLessonArray;
  students: any[];
}
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})

export class ReportsComponent implements OnInit {

  constructor(
    private lessonService: LessonService,
    private bookService: GetBooksService,
    private CompletedLessonController: CompletedLessonService,
    private http: HttpClient,
    private ClassController: ClassControllerService,
  ) { }
  @Input() classes;
  @Input() currentTab;
  allLessons;
  classStats: ClassStats[];
  currentSelectedClass: any = 'all';

  public polarAreaChartData: SingleDataSet = [];

  // Reporting variables
  activeStudents = 0;
  allstudents = 0;
  completedLessons = 0;
  gradeAvg: any;
  wpmAvg: any;
  timeSpent = 0;
  avereageReadingLevel: any;
  lessonsAboveEighty: any;
  highestStreak: any;
  public barChartData: ChartDataSets[] = [];
  public barChartLabels: Label[] = [];
  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'bpikmin' },
    { data: [28, 90], label: 'CGrimes' },
    { data: [100, 60, 100], label: 'shemStudent', yAxisID: 'y-axis-1' }
  ];
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  loading = true;
  allClasses: FullClassData[];

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];

  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [pluginAnnotations];



  public radarChartOptions: RadialChartOptions = {
    responsive: true,
  };
  public radarChartLabels: Label[] = ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'];

  public radarChartData: ChartDataSets[] = [
    { data: [65, 59, 90, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 96, 27, 100], label: 'Series B' }
  ];
  public radarChartType: ChartType = 'radar';


  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public doughnutChartData: MultiDataSet = [
    [350, 450, 100],
    [50, 150, 120],
    [250, 130, 70],
  ];
  public doughnutChartType: ChartType = 'doughnut';

  ngOnInit() {
    this.classStats = [];
    this.generateStatobject();
    this.getAllClasses();
    if (this.classes) {
      this.getClassStats();
    }

    this.getAllLessons();
  }

  getClassStats() {
    this.classes.forEach((clss) => {
      this.CompletedLessonController.getStatsForClass({ id: clss.id }).subscribe((statsResult) => {
        if (statsResult != null) {
          this.classStats.push({ clss, studentStats: statsResult });
          this.classStats.sort((a, b) => (a.clss.name > b.clss.name) ? 1 : -1);
        }
      });
    });
  }

  getAllLessons() {
    this.allLessons = [];
    this.lessonService.getLessons().subscribe(res => {
      if (res !== null) {
        res.forEach(lesson => {
          this.bookService.getBookInfo(lesson.bookId).subscribe(bookRes => {
            if (bookRes !== null) {
              const temp = new FullLessonData();
              temp.lessonData = lesson;
              temp.bookData = bookRes;
              this.allLessons.push(temp);

            }
          });
        });
      }
    });
  }

  printReport() {
    const printContent = document.getElementById('report-card');
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    // WindowPrt.document.write('<link rel="stylesheet" type="text/scss" href="../../../global.scss">');
    // WindowPrt.document.write(document.head.innerHTML);
    // WindowPrt.document.write(document.body.innerHTML);
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();

  }


  setAllStats(myclasses) {
    // init variables
    const bdArry: any[] = [];
    const bddata: any[] = [];

    const ldArry: any[] = [];
    const lddata: any[] = [];

    this.allstudents = 0;
    this.activeStudents = 0;
    this.completedLessons = 0;
    this.gradeAvg = .00;
    this.wpmAvg = 0;
    this.timeSpent = 0;
    this.avereageReadingLevel = 0;
    this.lessonsAboveEighty = 0;
    this.highestStreak = 0;

    this.barChartLabels = [];
    this.barChartData = [];

    for (let i = 0; i < myclasses.studentData.length; i++) {
      if (myclasses.studentData[i].streak > this.highestStreak) {
        this.highestStreak = myclasses.studentData[i].streak;
      }

      this.completedLessons = this.completedLessons + myclasses.studentData[i].readingLessons;
      this.gradeAvg = this.gradeAvg + myclasses.studentData[i].comprehension;
      this.wpmAvg = this.wpmAvg + myclasses.studentData[i].wpm;
      this.timeSpent = this.timeSpent + myclasses.studentData[i].totalTimeSpentReading;
      this.avereageReadingLevel = this.avereageReadingLevel + myclasses.students[i].reading_level;
      this.lessonsAboveEighty = this.lessonsAboveEighty + myclasses.studentData[i].readingLessons80Plus;

      if (myclasses.studentData[i].readingLessons > 0) {
        this.activeStudents = this.activeStudents + 1;
      }

      this.http.get(environment.gatewayBaseUrl + '/completed-lesson/getAllLessonScores?student_id=' + myclasses.students[i].id)
        .subscribe(
          (result: Array<any>) => {
            for (const x of result) {
              lddata.push(x.score);
              ldArry.push(x.lessonId);
            }
            console.log(result);
          });

      bdArry.push(myclasses.studentData[i].userName);
      bddata.push(myclasses.studentData[i].readingLessons);
    }

    // Get all students
    this.allstudents = myclasses.students.length;
    this.gradeAvg = this.gradeAvg / this.activeStudents;
    this.wpmAvg = (this.wpmAvg / this.allstudents).toFixed(2);
    this.avereageReadingLevel = this.avereageReadingLevel / this.activeStudents;

    console.log('bd data', bddata);

    this.barChartData = [
      { data: bddata }
    ];
    this.lineChartData = [
      { data: lddata }
    ];

    this.pieChartLabels = bddata;
    this.barChartLabels = bdArry;
    this.pieChartData = bddata;


    this.lineChartLabels = ldArry;

    //  public lineChartData: ChartDataSets[] = [
    //   { data: [65, 59, 80, 81, 56, 55, 40], label: 'bpikmin' },
    //   { data: [28, 90], label: 'CGrimes' },
    //   { data: [100,60,100], label: 'shemStudent', yAxisID: 'y-axis-1' }
    // ];

  }

  getAllClasses() {
    this.allClasses = [];
    const uName = localStorage.getItem('logedInUsername');
    this.ClassController.getClassesWithTeacherName({ uName }).subscribe((result) => {
      if (result !== null) {
        const anyResult = result as any;
        anyResult.forEach(inputClass => {
          const newClass: FullClassData = {
            classData: null,
            studentData: null,
            students: inputClass.students
          };
          this.CompletedLessonController.getStatsForClass({ id: inputClass.id }).subscribe((statsResult) => {
            if (statsResult != null) {
              const statsResultAny = statsResult;
              newClass.studentData = statsResultAny;
              newClass.classData = inputClass;
              this.allClasses.push(newClass);
              this.allClasses.sort((a, b) => (a.classData.name > b.classData.name) ? 1 : -1);
            }
          });
        });
      }
      this.loading = false;
    });
  }


  generateStatobject() {
    const uName = localStorage.getItem('logedInUsername');
    this.ClassController.getClassesWithTeacherName({ uName }).subscribe((response1) => {

      let responseItem1 = [];
      responseItem1 = response1;
      responseItem1.forEach((classItem, classIndex) => {
        this.CompletedLessonController.getStatsForClass({ id: classItem.id }).subscribe((response2) => {
          let responseItem2 = [];
          responseItem2 = response2;
          const tempClassesStudents = [];
          const lostItems = [];
          let lostItemStart = null;
          responseItem2.forEach((studentItem, studentIndex) => {
            if (responseItem1[classIndex].students[studentIndex].username === studentItem.userName) {
              const tempStudentActiveBoolean = {
                activeStudent: studentItem.readingLessons > 0
              };
              responseItem1[classIndex].students[studentIndex] =
                Object.assign(responseItem1[classIndex].students[studentIndex], studentItem, tempStudentActiveBoolean);
            } else {
              lostItems.push(studentItem);
              if (lostItemStart === null) {
                lostItemStart = studentIndex;
              }
              lostItems.forEach((lostItem, lostIndex) => {
                if (responseItem1[classIndex].students[studentIndex].username === lostItem.userName) {
                  const tempStudentActiveBoolean = {
                    activeStudent: lostItem.readingLessons > 0
                  };
                  responseItem1[classIndex].students[studentIndex] =
                    Object.assign(responseItem1[classIndex].students[studentIndex], lostItem, tempStudentActiveBoolean);
                  lostItems.splice(lostIndex, 1);
                }
              });
            }
          });
          if (lostItems.length > 0) {
            if (responseItem1[classIndex].students[lostItemStart].username === lostItems[0].userName) {
              const tempStudentActiveBoolean = {
                activeStudent: lostItems[0].readingLessons > 0
              };
              responseItem1[classIndex].students[lostItemStart] =
                Object.assign(responseItem1[classIndex].students[lostItemStart], lostItems[0], tempStudentActiveBoolean);
              lostItems.splice(0, 1);
            }
          }
        });
      });
      setTimeout(() => {
        this.chartstatsAllClasses(responseItem1);
      }, 2000);
    });
  }


  chartstatsAllClasses(myclasses) {
    this.allstudents = 0;
    this.activeStudents = 0;
    this.completedLessons = 0;
    this.gradeAvg = .00;
    this.wpmAvg = 0;
    this.timeSpent = 0;
    this.avereageReadingLevel = 0;
    this.lessonsAboveEighty = 0;
    this.highestStreak = 0;

    myclasses.forEach(element => {
      this.allstudents = this.allstudents + element.students.length;
      for (const student of element.students) {
        if (student.activeStudent === true) {
          if (student.streak > this.highestStreak) {
            this.highestStreak = student.streak;
          }
          this.activeStudents = this.activeStudents + 1;
          this.completedLessons = this.completedLessons + student.readingLessons;
          this.gradeAvg = this.gradeAvg + student.comprehension;
          this.wpmAvg = this.wpmAvg + student.wpm;
          this.timeSpent = this.timeSpent + student.totalTimeSpentReading;
          this.avereageReadingLevel = this.avereageReadingLevel + student.reading_level;
          this.lessonsAboveEighty = this.lessonsAboveEighty + student.readingLessons80Plus;
        }
      }
    });
    this.gradeAvg = this.gradeAvg / this.activeStudents;
    this.wpmAvg = (this.wpmAvg / this.allstudents).toFixed(2);
    this.avereageReadingLevel = this.avereageReadingLevel / this.activeStudents;
  }


  handleClassSection(ev: any) {
    if (ev.detail.value === 'all') {
      this.generateStatobject();
    } else {
      this.setAllStats(ev.detail.value);
    }
  }
}
