import {Component, Input, OnInit} from '@angular/core';
import {GetBooksService} from '../../../../Providers/books/get-books.service';
import {BookInfo} from '../../../../model/book-info';
import { HttpClient } from '@angular/common/http';
import { Book } from 'epubjs';
import { ModalController, PopoverController } from '@ionic/angular';
import { SelectLocationsPage } from 'src/app/reader/select-locations/select-locations.page';
import { ChapterSelectPopoverPage } from './chapter-select-popover/chapter-select-popover.page';
import {AddReadingBookSelectPopoverComponent} from "./add-reading-book-select-popover/add-reading-book-select-popover.component";

@Component({
  selector: 'app-add-reading',
  templateUrl: './add-reading.component.html',
  styleUrls: ['./add-reading.component.scss'],
})
export class AddReadingComponent implements OnInit {
  readingInfo = new LessonDataReadingInfo();
  book: Book;
  loadingToc: boolean = false;
  selectChapters: boolean = false;
  toc: any;

  bookInfos: BookInfo[];
  bookSelected: boolean = false;
  selectRange: boolean;


  public form = {
    Reader: { val: 'bookId', isChecked: true },
  };


  constructor(
    private getBooksService: GetBooksService,
    private http: HttpClient,
    public modalController: ModalController,
    public popoverController: PopoverController
  ) {
    this.readingInfo.wordCount = 0;
  }

  ngOnInit() {
    this.getBooksService.getBooksInfo().subscribe(
      bookInfos => {
        if (bookInfos) {
          this.bookInfos = bookInfos;
          console.log(this.bookInfos)
        }
      }
    );
  }

  @Input()
  set initialReadingInfo(readingInfo: LessonDataReadingInfo) {
    if (readingInfo !== undefined) {
      this.readingInfo = readingInfo;
      this.bookSelected = true;
    }
  }

  bookCompareWith(b1, b2) {
    return b1 && b2 ? b1 === b2.toString() : b1 === b2;
  }

  /**
   * Get each Table of Contents item
   * @param toc table of contents
   */
  getBookToc(event) {
    this.presentPopover(event);
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: ChapterSelectPopoverPage,
      event: ev,
      mode: 'ios',
      componentProps: {
        bookId: this.readingInfo.bookId
      }
    });

    await popover.present();

    await popover.onDidDismiss().then((res) => {
      this.readingInfo.bookStart = res.data.startLoc.href;

      if(res.data.endLoc)
        this.readingInfo.bookEnd = res.data.endLoc.href;
      else
        this.readingInfo.bookEnd = 'end';
    })
  }

  selectReadingPopoverOptions: any = {
    header: 'Select Reading',
    cssClass: 'select'
  };

  openSelectRange(){
    this.selectRange = true;
    this.selectPagesModal();
  }

  async selectPagesModal() {
    const modal = await this.modalController.create({
      component: SelectLocationsPage,
      cssClass: 'select-locations',
      backdropDismiss: false,
      componentProps: {
        bookId: this.readingInfo.bookId,
      }
    });
    await modal.present();

    return modal.onDidDismiss().then((res: any) => {
      console.log(res.data.submit)

      if(res.data.submit){
        this.readingInfo.bookStart = res.data.startLoc;
        this.readingInfo.bookEnd = res.data.endLoc;
      }
    });
  }

  resetForm() {
    this.selectChapters = false;
    this.selectRange = false;
    this.readingInfo.chapter = undefined;
    this.readingInfo.bookStart = undefined;
    this.readingInfo.bookEnd = undefined;
  }

  isComplete() {
    return this.readingInfo.bookId !== undefined;
  }

  async selectBook() {
    const modal = await this.modalController.create({
      component: AddReadingBookSelectPopoverComponent,
      cssClass: 'select-reading',
      componentProps: {
        books: this.bookInfos
      }
    });
    await modal.present();

    return modal.onDidDismiss().then(res => {
      if (res.data) {
        this.readingInfo.bookId = res.data;
      }
    })
  }

  getBookTitle() {
    let index = -1
    this.bookInfos.forEach((book, ind) => {
      if (book.id == this.readingInfo.bookId){
        index = ind;
      }
    })

    return this.bookInfos[index].title;
  }
}

export class LessonDataReadingInfo
{
  public bookId: number;
  public chapter: string;
  public bookStart: string;
  public bookEnd: string;
  public wordCount: number;
}
