import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { IBook } from './IBook';
import { Router } from '@angular/router';
import {ModalController} from "@ionic/angular";
import {AddBookModalComponent} from "./add-book-modal/add-book-modal.component";
import {GetBooksService} from "../../Providers/books/get-books.service";
import {ImageModalPage} from "../../modals/image-modal/image-modal.page";

@Component({
  selector: 'app-book',
  templateUrl: './book.page.html',
  styleUrls: ['./book.page.scss'],
})
export class BookPage implements OnInit {
  private baseUrl: string = environment.gatewayBaseUrl;
  book = {
    title: '',
    author: '',
    shortDescription: '',
    level: null,
    base64Cover: '',
    base64eBook: ''
  };
  allBooks: IBook[];
  showBookModal = false;
  ready = false;
  imageFileName = 'Choose File';
  epubFileName = 'Choose File';
  searchText = '';
  grid: boolean = true;
  loaded: boolean = false;

  constructor(private http: HttpClient, 
    private sanitizer: DomSanitizer,
    private route: Router,
    private modalController: ModalController,
    private bookService: GetBooksService
  ) { }

  ngOnInit() {
    this.getAllBooks();
  }

  getAllBooks() {
    this.bookService.getBooks().subscribe(
    (data: IBook[]) => {
      if (data){
        this.allBooks = data;
        this.allBooks = this.getAscend()
        this.loaded = true;
      }
    });
  }

  getAscend() {
    return this.allBooks.sort((first, second) => 0 - (first.title.toLowerCase() > second.title.toLowerCase()  ? -1 : 1));
  }

  getCoverImage(book) {
    if (book.base64Cover != null){
    const objectURL = 'data:image/png;base64,' + book.base64Cover;
    return this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
    }
  }

  handleFileSelectCoverImage(evt) {
    const files = evt.target.files;
    const file = files[0];
    if (files && file) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoadedCoverImage.bind(this);
      reader.readAsBinaryString(file);
      this.imageFileName = file.name;
    }
  }

  handleReaderLoadedCoverImage(readerEvt) {
    const binaryString = readerEvt.target.result;
    this.book.base64Cover = btoa(binaryString);
  }

  handleFileSelectEpub(evt) {
    const files = evt.target.files;
    const file = files[0];
    if (files && file) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoadedEpub.bind(this);
      reader.readAsBinaryString(file);
      this.epubFileName = file.name;
    }
  }

  handleReaderLoadedEpub(readerEvt) {
    const binaryString = readerEvt.target.result;
    this.book.base64eBook = btoa(binaryString);
  }

  saveBook(book: any) {
    if (book.id) {
      this.http.post(this.baseUrl + '/books/updateBook', book).subscribe((result) => {
        this.showBookModal = false;
     });
    } else {
      this.http.post(this.baseUrl + '/books/addBook', book).subscribe((data: IBook) => {
        this.showBookModal = false;
        this.allBooks.push(data);
     });
    }
  }

  setBook(thisBook: any) {
    this.book = thisBook;
    let res = this.presentAddBookModal();
  }

  clearBook() {
    this.book = {
      title: '',
      author: '',
      shortDescription: '',
      level: null,
      base64Cover: '',
      base64eBook: ''
    };
    this.imageFileName = 'Choose File';
    this.epubFileName = 'Choose File';
  }

  deleteBook(book, index) {
    const confirmation = confirm('Are You Sure?');
    if (confirmation){
      this.http.delete(this.baseUrl + '/books/deleteBook?id=' + book.id).subscribe((result) => {
        const removeIndex = this.allBooks.map((item) => item.id).indexOf(book.id);
        if (removeIndex !== -1) {
          this.allBooks.splice(removeIndex, 1);
        } else {
          this.getAllBooks();
        }
      });
    }
  }

  goToBook(book){
    this.route.navigate(["/reader/" + book.id])
  }

  addBook() {
    let res = this.presentAddBookModal();
  }

  async presentAddBookModal() {
    const modal = await this.modalController.create({
      component: AddBookModalComponent,
      cssClass: 'add-book-modal',
      backdropDismiss: false,
      componentProps: {
        book: this.book
      }
    });

    await modal.present();
  }

  enlargeImage(src){
    this.presentBookImageModal(src);
  }

  async presentBookImageModal(src: string) {
    const modal = await this.modalController.create({
      component: ImageModalPage,
      cssClass: 'book-cover-modal',
      componentProps: {
        src: src
      }
    });

    await modal.present();
  }

  counter(i: number) {
    return new Array(i);
  }
}
