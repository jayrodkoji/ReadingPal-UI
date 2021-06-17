import { Component, OnInit, HostListener } from '@angular/core';
import { BADGES } from '../../../tempData/badges';
import { QUIZES } from '../../../tempData/quizes';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { LessonData } from '../../../Providers/lesson-services/lesson-services-models/lesson-data';
import { QuizControllerService } from '../../../Providers/quiz-controller/quiz-controller.service';
import { QuizQuestion } from '../../../Providers/quiz-controller/quiz-data';
import { BOOKS } from '../../../tempData/mock-books';
import { GetBooksService } from '../../../Providers/books/get-books.service';
import { BookInfo } from '../../../model/book-info';
import { LessonService } from '../../../Providers/lesson-services/lesson.service';
import { ImageUtils } from 'src/app/utils/image-utils';
import { DomSanitizer } from '@angular/platform-browser';
import { VocabularyServicesService } from "../../../Providers/vocabulary-services/vocabulary-services.service";
import { VocabDefinitionComponent } from "../../../shared/popover/vocab/vocab-definition/vocab-definition.component";
import { PopoverController } from "@ionic/angular";
import {BadgeControllerService} from '../../../Providers/badges/badge-controller.service';
import {BadgeData} from "../../../Providers/badges/badge-data";

const XS = 530;
const SM = 642;
const MD = 1050;


@Component({
  selector: 'app-lesson-overview',
  templateUrl: './lesson-overview.page.html',
  styleUrls: ['./lesson-overview.page.scss'],
  providers: [QuizControllerService]
})
export class LessonOverviewPage implements OnInit {
  lessonId: string;
  words: string[];

  // TODO: Needs to pull from data base for specific data (book rating, lesson rating, etc.). \
  // If the user has rated it should pull their rating otherwise it should pull overall rating.
  rating = null;
  badges = BADGES;
  quizes = QUIZES;
  book = BOOKS[0];
  bookInfo: BookInfo;

  numStudentsDisplayed: number;
  slideOptions: any;
  // quizOverviews: CategorizedQuizOverviews;
  quiz: QuizQuestion[];
  lesson: LessonData;

  cover: any

  noSelectedLesson: boolean = true;
  noBook: boolean = false;
  badge: BadgeData;

  constructor(
    private lessonController: LessonService,
    private quizController: QuizControllerService,
    private vocabController: VocabularyServicesService,
    private bookService: GetBooksService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    public popoverController: PopoverController,
    public badgeCreatorService: BadgeControllerService) { }

  ngOnInit() {
    if(!this.lesson){
      this.getLesson();
    }
  }

  getLesson() {
    this.lessonId = this.route.snapshot.paramMap.get('id');

    if(this.lessonId){
      // Get current lesson from database
      this.lessonController.getLessonById(this.lessonId).subscribe((result: LessonData) => {
        this.lesson = new LessonData(result);
        this.getBadge();

        this.noSelectedLesson = false;

        this.setBookCover(this.lesson);
        this.getBookInfo(this.lesson);
        this.getQuiz();
        this.getVocabulary();

        this.setNumStudentsDisplayed(window.innerWidth);
      });
    }
  }

  getBookInfo(ls: LessonData) {
    if(ls.bookId){
      this.bookService.getBookInfo(ls.bookId).subscribe((res: BookInfo) => {
        if (res){
          this.bookInfo = res;
        }
      });
    } else {
      console.error("No book Identified");
      this.noBook = true;
    }
  }

  setBookCover(ls) {
    if(ls.bookId){
      this.bookService.getBook(ls.bookId).subscribe((res: any) => {
        if (res){
          this.cover = ImageUtils.decodeDBImage(this.sanitizer, ImageUtils.convertDBImage(res.base64Cover));
        }
      });
    } else {
      console.error("No book Identified");
      this.noBook = true;
    }
    
  }

  getCoverImage() {
    return this.cover;
  }

  getQuiz() {
    if(this.lessonId){
      this.quizController.getQuestionsRequest(this.lessonId).subscribe((res: QuizQuestion[]) => {
        this.quiz = res;

        console.log("quiz", res)
      })   
    }
  }

  getVocabulary() {
    if(this.lessonId) {
      this.vocabController.getVocab(this.lessonId).subscribe((res: string[]) => {
        this.words = res.map(x => x.toLowerCase());
      })
    }
  }

  ratingChange(newRating) {
    // TODO: This should write to data base as well.
    this.rating = newRating;
    console.log(newRating);
  }

  setNumStudentsDisplayed(windowWidth){
    if (windowWidth){
      if (windowWidth < XS){
        this.numStudentsDisplayed = 4;
      }
      else if (windowWidth < SM) {
        this.numStudentsDisplayed = 5;
      }
      else if (windowWidth < MD) {
        this.numStudentsDisplayed = 6;
      }
      else {
        this.numStudentsDisplayed = 6;
      }

      this.slideOptions = {
        slidesPerView: this.numStudentsDisplayed,
        zoom: false,
        grabCursor: true
      };
    }
  }

  openBook(){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "lessonId": this.lessonId,
      }
    };
    this.router.navigate(["../reader/" + this.lesson.bookId], navigationExtras);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setNumStudentsDisplayed(window.innerWidth);
  }

  openQuizWithState() {
    this.quizController.getQuestionsRequest(this.lessonId)
      .subscribe(
        then => {
          if (then !== null) {
            const navigationExtras: NavigationExtras = {
              replaceUrl: false,
              state: {
                quiz: then as QuizQuestion[]
              }
            };
            console.log(then as QuizQuestion[]);
            this.router.navigate(['../quiz'], navigationExtras);
          }
        }
      );
  }

  async openDefinition(e, word) {
    const popover = await this.popoverController.create({
      component: VocabDefinitionComponent,
      event: e,
      mode: 'ios',
      componentProps: { word: word },
      cssClass: 'vocab-definition'
    });
    return await popover.present();
  }

  getBadge() {
    if (this.lesson.badgeId) {
      this.badgeCreatorService.getBadgeById(this.lesson.badgeId.toString())
        .subscribe(
            (res: BadgeData[]) => {
            this.badge = res[0];
            this.badge.icon = ImageUtils.convertDBImage(this.badge.icon);
          }
        );
    }
  }
}
