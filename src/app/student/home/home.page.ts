import {Component, OnInit, HostListener, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { BADGES } from 'src/app/tempData/badges';
import { BOOKS } from 'src/app/tempData/mock-books';
import {StudentService} from '../../Providers/student-controller/student.service';
import {LessonService} from '../../Providers/lesson-services/lesson.service';
import {BehaviorSubject, forkJoin, Observable, Subject} from 'rxjs';
import {ImageUtils} from '../../rp-utils/image-utils';
import {GetBooksService} from '../../Providers/books/get-books.service';
import {DomSanitizer} from '@angular/platform-browser';
import * as dayjs from 'dayjs';
import * as RelativeTime from 'dayjs/plugin/relativeTime';
import * as Duration from 'dayjs/plugin/duration';
import {AssignmentListViewComponent} from './assignment-list-view/assignment-list-view.component';
import {CompletedLessonService} from "../../Providers/completed-lesson/completed-lesson.service";

const XS = 530;
const SM = 642;
const MD = 1050;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {
  badges = BADGES;

  numStudentsDisplayed: number;
  slideOptions: any;
  book = BOOKS[0];

  assignedLessons: any[];
  overdueLessons: any[];
  dueLessons: any[];
  lessonAssignments: any[];
  books: any[];
  studentId: number;

  @ViewChild('overdueAssignments') overdueAssignmentsRef: AssignmentListViewComponent;
  @ViewChild('dueAssignments') dueAssignmentsRef: AssignmentListViewComponent;
  @ViewChild('completedAssignments') completedAssignmentsRef: AssignmentListViewComponent;
  
  constructor(
    private studentController: StudentService,
    private lessonController: LessonService,
    private bookService: GetBooksService,
    private completedLessonService: CompletedLessonService,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.setNumStudentsDisplayed(window.innerWidth);
    dayjs.extend(RelativeTime);
    dayjs.extend(Duration);
  }

  ngAfterViewInit() {
    this.studentController.getStudentByUsername(localStorage.getItem('logedInUsername'))
      .subscribe(student => {
        if (student !== null) {
          this.studentId = student.id;
          this.lessonController.getAssignLessonFiltered(this.studentId)
            .subscribe((lessonAssignments: any[]) => {
              // TODO: Get student's scores to see which lessons they have already completed.
              this.lessonAssignments = lessonAssignments.map(
                o => ({
                  ms: this.msToLesson(o),
                  assignment: o
                }));
              this.lessonAssignments.sort(
                (a, b) => a.ms - b.ms);
              forkJoin(this.lessonAssignments.map(
                o => this.getLesson(o.assignment)
              )).subscribe(
                (lessons: any[]) => {
                  this.loadBooks(lessons)
                    .subscribe(books => {
                      this.books = books;
                      this.assignedLessons = lessons;
                      this.sliceLessonsToViews();
                    });
                }
              );
            });
        }
      });
  }

  sliceLessonsToViews() {
    let i = 0;
    const n = this.assignedLessons.length;
    let dueIndex = n;

    // Overdue
    for (; i < n; i++) {
      if (this.lessonAssignments[i].ms > 0) {
        dueIndex = i;
        break;
      }
    }

    console.log(this.lessonAssignments)

    this.overdueAssignmentsRef.lessonAssignments = this.lessonAssignments.slice(0, dueIndex);
    this.overdueLessons = this.assignedLessons.slice(0, dueIndex);
    this.overdueAssignmentsRef.assignedLessons = this.overdueLessons;
    this.overdueAssignmentsRef.books = this.books.slice(0, dueIndex);

    this.dueAssignmentsRef.lessonAssignments = this.lessonAssignments.slice(dueIndex, n);
    this.dueLessons = this.assignedLessons.slice(dueIndex, n);
    this.dueAssignmentsRef.assignedLessons = this.dueLessons;
    this.dueAssignmentsRef.books = this.books.slice(dueIndex, n);
  }

  getLesson(assignment) {
    return this.lessonController.getLessonById(assignment.lessonId.toString());
  }

  loadBooks(lessons: any[]): Observable<any> {
    const subject = new Subject<any>();

    const subjects = lessons.map(
      lesson => this.loadBook(lesson)
    );

    forkJoin(subjects).subscribe(
      books => {
        subject.next(books);
        this.books = books;
        for (let i = 0; i < books.length; i++) {
          if (books[i] === null) {
            subjects[i].subscribe(res => {
              this.books[i] = res;
            });
          }
        }
      }
    );

    return subject.asObservable();
  }

  loadBook(lesson: any): Observable<any> {
    if (lesson.bookid) {
      const subject = new Subject<any>();
      this.bookService.getBook(lesson.bookid)
        .subscribe((book: any) => {
          book.cover = ImageUtils.decodeDBImage(
            this.sanitizer, ImageUtils.convertDBImage(book.base64Cover));
          subject.next(book);
          subject.complete();
        });
      return subject.asObservable();
    }
    else {
      return new BehaviorSubject<any>(undefined).asObservable();
    }
  }

  lessonDueDateParsed(lesson: any) {
    return dayjs(lesson.dueDate, 'YYYY-MM-DD HH:MM:ss.SSS');
  }

  msToLesson(lesson: any) {
    return dayjs.duration(
      this.lessonDueDateParsed(lesson).diff(dayjs())
    ).asMilliseconds();
  }

  navLessonOverview() {
    console.log("navigate to lesson overview");
  }

  setNumStudentsDisplayed(windowWidth){
    if (windowWidth){
      if (windowWidth < 390){
        this.numStudentsDisplayed = 2;
      }
      else if (windowWidth < XS){
        this.numStudentsDisplayed = 3;
      }
      else if (windowWidth < SM) {
        this.numStudentsDisplayed = 4;
      }
      else if (windowWidth < MD) {
        this.numStudentsDisplayed = 5;
      }
      else {
        this.numStudentsDisplayed = 7;
      }

      this.slideOptions = { 
        slidesPerView: this.numStudentsDisplayed, 
        zoom: false, 
        grabCursor: true 
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setNumStudentsDisplayed(window.innerWidth);
  }

}
