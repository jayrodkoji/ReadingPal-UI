import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BOOKS } from '../tempData/mock-books';
import {IBook} from '../teacher/book/IBook';
import {GetBooksService} from '../Providers/books/get-books.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
})
export class LibraryPage implements OnInit {
  book = BOOKS;
  grid = true;
  searchText = '';

  allBooks: IBook[];

  constructor(
      private route: Router,
      private bookService: GetBooksService,
  ) { }

  ngOnInit() {
    this.getAllBooks();
  }

  getAllBooks() {
    this.bookService.getBooks().subscribe(
        (data: IBook[]) => {
          if (data){
            this.allBooks = data;
            this.allBooks = this.getAscend();
          }
        });
  }

  getAscend() {
    return this.allBooks.sort((first, second) => 0 - (first.title.toLowerCase() > second.title.toLowerCase()  ? -1 : 1));
  }

  goToBook(book){
    this.route.navigate(['/reader/' + book.id]);
  }

  counter(i: number) {
    return new Array(i);
  }

}
