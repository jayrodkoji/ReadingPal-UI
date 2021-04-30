import { Component, OnInit } from '@angular/core';
import {LessonArray, LessonData} from '../../../Providers/lesson-services/lesson-services-models/lesson-data';
import {ImageUtils} from '../../../rp-utils/image-utils';
import {DomSanitizer} from '@angular/platform-browser';
import {ModalController, PopoverController} from '@ionic/angular';
import { LessonService } from 'src/app/Providers/lesson-services/lesson.service';
import { GetBooksService } from 'src/app/Providers/books/get-books.service';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {LessonOptionsPopComponent} from "./lesson-options-pop/lesson-options-pop.component";



@Component({
  selector: 'app-browse-lessons',
  templateUrl: './browse-lessons.page.html',
  styleUrls: ['./browse-lessons.page.scss'],
})
export class BrowseLessonsPage implements OnInit {
  lessons: LessonArray;
  loaded: boolean = false;
  search: boolean = false;
  lessonCreatorFilter: string = 'my';
  creator: string;
  hasLessons: boolean = false;

  covers: Map<any, any>;
  books: Map<any, any>;
  orientation = "ascend";

  verifyDeleteIndex = -1;

  constructor(
    public lessonService: LessonService,
    public bookService: GetBooksService,
    private sanitizer: DomSanitizer,
    public modalController: ModalController,
    private router: Router,
    private route: ActivatedRoute,
    public popoverController: PopoverController
  ) { }

  ngOnInit() {
    this.creator = localStorage.getItem('logedInUsername');
    this.covers = new Map();
    this.books = new Map();
    this.getLessons();
  }

  getLessons() {
    this.lessonService.getLessons().subscribe(
      result => {
        if (result !== null) {
          this.lessons = result;

          this.checkHasLessons();

          this.lessons = this.getAscend();

          // get covers
          const idSet = new Set();
          for (const lesson of this.lessons) {
            if (!idSet.has(lesson.bookId)) {
              idSet.add(lesson.bookId);
              this.setBookInfo(lesson);
            }
          }

          this.loaded = true;
        }
      });
  }

  setBookInfo(ls: LessonData) {
    this.bookService.getBook(ls.bookId).subscribe((res: any) => {
      if (res) {
        this.covers.set(ls.bookId, ImageUtils.decodeDBImage(this.sanitizer, ImageUtils.convertDBImage(res.base64Cover)));
        this.books.set(ls.bookId, res);
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

  getAscend() {
    return this.lessons.sort((first, second) => 0 - (first.title.toLowerCase() > second.title.toLowerCase()  ? -1 : 1));
  }

  getDescend() {
    return this.lessons.sort((first, second) => 0 - (first.title.toLowerCase() < second.title.toLowerCase()  ? -1 : 1));
  }

  getCoverImage(lesson) {
    return this.covers.get(lesson.bookId);
  }

  onCreation(lesson: LessonData) {
    this.lessons.unshift(lesson);
  }

  getRating() {
    let val = 4; //Math.floor((Math.random() * 5) + 3)
    return val > 5 ? 5 : val;
  }

  async onClickDelete(index: number) {
    const lesson = this.lessons[index];
    this.lessonService.deleteLesson({id: lesson.id})
      .subscribe(() => {});

    this.checkHasLessons();
  }

  onClickEdit(index: number) {
    const lesson = this.lessons[index];
    const navigationExtras: NavigationExtras = {
      replaceUrl: false,
      relativeTo: this.route,
      state: {
        lesson: lesson,
        isEdit: true
      }
    };
    this.router.navigate(['../../../create-lesson'], navigationExtras);
  }

  onClickDuplicate(index: number) {
    const lesson = this.lessons[index];
    const navigationExtras: NavigationExtras = {
      replaceUrl: false,
      relativeTo: this.route,
      state: {
        lesson: lesson
      }
    };
    this.router.navigate(['../../../create-lesson'], navigationExtras);
  }

  /*deleteLesson(id: number) {
    let lesson: any = this.lessons[id]
    this.lessonService.deleteLesson(lesson).subscribe(() => {
      this.loaded = true;
    });
  }*/

  lessonOptions(ev, index: number) {
    this.presentPopover(ev, index);
  }

  async presentPopover(ev: any, index: number) {
    const lesson = this.lessons[index];
    const popover = await this.popoverController.create({
      component: LessonOptionsPopComponent,
      cssClass: 'lesson-options-popover',
      event: ev,
      mode: 'ios',
      componentProps: {
        lesson: lesson,
        canDelete: lesson.creator === this.creator
      }
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();
    if (data) {
      if (data.delete) {
        await this.onClickDelete(index);
      }
      else {
        const navigationExtras: NavigationExtras = {
          replaceUrl: false,
          relativeTo: this.route,
          state: {
            lesson: lesson,
            isEdit: data.isEdit
          }
        };

        this.router.navigate(['../../../create-lesson'], navigationExtras);
      }
    }
  }

  private checkHasLessons() {
    this.lessons.forEach(lesson => {
      if(lesson.creator === this.creator){
        this.hasLessons = true;
      }
    })

    return this.hasLessons;
  }
}
