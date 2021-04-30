import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { GetBooksService } from 'src/app/Providers/books/get-books.service';
import { LessonArray, LessonData } from 'src/app/Providers/lesson-services/lesson-services-models/lesson-data';
import { LessonService } from 'src/app/Providers/lesson-services/lesson.service';
import { ImageUtils } from 'src/app/rp-utils/image-utils';

@Component({
  selector: 'app-browse-lessons',
  templateUrl: './browse-lessons.page.html',
  styleUrls: ['./browse-lessons.page.scss'],
})
export class BrowseLessonsPage implements OnInit {
  lessons: LessonArray;
  loaded: boolean = false;
  search: boolean = false;
  searchText = '';
  orientation = "ascend"

  covers: Map<any, any>;

  constructor(
    public lessonController: LessonService,
    private sanitizer: DomSanitizer,
    public modalController: ModalController,
    public bookService: GetBooksService,
    private router: Router
  ) { }

  ngOnInit() {
    this.covers = new Map();

    this.lessonController.getLessons().subscribe(
      result => {
        if (result !== null) {
          this.lessons = result
          this.lessons = this.getAscend()
          this.loaded = true;

          for (let lesson of this.lessons){
            this.setBookCover(lesson);
          }

        }
      }
    );
  }

  getAscend() {
    return this.lessons.sort((first, second) => 0 - (first.title.toLowerCase() > second.title.toLowerCase()  ? -1 : 1));
  }

  getDescend() {
    return this.lessons.sort((first, second) => 0 - (first.title.toLowerCase() < second.title.toLowerCase()  ? -1 : 1));
  }

  setBookCover(ls: LessonData) {
    this.bookService.getBook(ls.bookId).subscribe((res: any) => {
      if (res){
        this.covers.set(ls.bookId, ImageUtils.decodeDBImage(this.sanitizer, ImageUtils.convertDBImage(res.base64Cover)));
      }
    });
  }

  orderList() {
    if(this.orientation === "ascend") {
      this.lessons = this.getAscend();
    } else if (this.orientation === "descend"){

      this.lessons = this.getDescend();
    }
  }

  getCoverImage(lesson) {
    return this.covers.get(lesson.bookId);
  }

  onCreation(lesson: LessonData) {
    this.lessons.unshift(lesson);
  }

  getRating() {
    return 5
  }

  displayLesson() {
    console.log("displayed")
  }

  openLessonOverview(lesson) {
    this.router.navigate(["/student/lesson/lesson-overview/" + lesson.id])
  }

  alertImageLoad() {
    alert("image loaded")
  }
}
