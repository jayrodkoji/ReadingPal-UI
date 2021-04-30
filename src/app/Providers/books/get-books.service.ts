import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BookInfo } from '../../model/book-info';
import { Book } from "./books-service-models/book";
import {BadgeData} from "../badges/badge-data";
import {DomSanitizer} from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class GetBooksService {
  private bookInfosSubject: BehaviorSubject<BookInfo[]>;
  private bookSubject: BehaviorSubject<Book[]>;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,) {
  }

  /**
   * Add Book
   */
  public addBook(data: Book): Observable<any> {
    this.http.post(
      environment.gatewayBaseUrl + '/books/addBook',
      data).subscribe(
      (result: Book) => {
        console.log(result)
        if(result) {
          result.base64Cover = 'data:image/png;base64,'
              + (this.sanitizer.bypassSecurityTrustResourceUrl(result.base64Cover) as any).changingThisBreaksApplicationSecurity;
          this.bookSubject.getValue().push(result);
          this.bookSubject.next(this.bookSubject.getValue());
        }
      });

      return this.bookSubject.asObservable();
  }

  /**
   * update Book
   */
  public updateBook(data: Book): Observable<any> {
    return this.http.post(
        environment.gatewayBaseUrl + '/books/updateBook',
        data);
  }

  /**
   * Todo: Create basicauth
   */

  /**
   * Delete a book by id
   * @param bookId
   */
  public deleteBook(bookId: string): Observable<any> {
    const params = new HttpParams()
        .set('id', bookId);

    return this.http.delete(
        environment.gatewayBaseUrl + '/books/deleteBook',
        { params }
    )
  }

  /**
   * Todo: Create Format-book
   *
   */

  /**
   *  Get the base64 string for book
   * @param file: epub file
   */
  public getBase64(file: any): Observable<any> {
    const params = new HttpParams()
        .set('file', file)

    return this.http.get(environment.gatewayBaseUrl + '/books/get-base64', { params });
  }

  /**
   * Get book info for individual book by id
   * @param bookId
   */
  public getBookInfo(bookId: number): Observable<any> {
    const params = new HttpParams().set('id', bookId.toString());

    return this.http.get(
        environment.gatewayBaseUrl + '/books/get-book-info', { params });
  }

  /**
   * Get all books info
   */
  public getBooksInfo(): Observable<BookInfo[]> {
    this.bookInfosSubject = new BehaviorSubject<BookInfo[]>(null);

    this.http.get(
        environment.gatewayBaseUrl + '/books/get-books-info').subscribe(
        (result: any[]) => {
          this.bookInfosSubject.next(result.map(o => o as BookInfo));
        }
    );
    return this.bookInfosSubject.asObservable();
  }

  /**
   * Get word count of chapter
   * @param bookName
   * @param chapId
   */
  public getChapWordCountById(bookName: string, chapId: string): Observable<any> {
    const params = new HttpParams()
        .set('bookName', bookName)
        .set('chapId', chapId);

    return this.http.get(environment.gatewayBaseUrl + '/books/get-chap-word-count', { params });
  }

  /**
   * Get word count of chapter
   * @param bookName
   * @param chapFileName
   */
  public getChapWordCountByName(bookName: string, chapFileName: string): Observable<any> {
    const params = new HttpParams()
        .set('bookName', bookName)
        .set('chapFileName', chapFileName);

    return this.http.get(environment.gatewayBaseUrl + '/books/get-chapter-word-count', { params });
  }

  /**
   * Basically the same as bookinfo but returns cover
   * @param bookId
   * Todo: get rid of this or getBookInfo
   */
  public getBook(bookId) {
    return this.http.get(
      environment.gatewayBaseUrl + '/books/getBook?id=' + bookId)
  }

  /**
   * Basically the same as booksinfo but returns books with their cover
   * Todo: get rid of this or getBooksInfo
   */
  public getBooks(): Observable<Book[]> {
    this.bookSubject = new BehaviorSubject<Book[]>(null);

    this.http.get(
        environment.gatewayBaseUrl + '/books/getBooks').subscribe(
        (result: Book[]) => {
          let bookList = result.map(o => o as Book)
          bookList.forEach(element => {
            if (element.base64Cover !== null) {
              element.base64Cover = 'data:image/png;base64,'
                  + (this.sanitizer.bypassSecurityTrustResourceUrl(element.base64Cover) as any).changingThisBreaksApplicationSecurity;
            }
          });

          this.bookSubject.next(bookList);
        }
    );

    return this.bookSubject.asObservable();
  }

  /**
   * Basically the same as getBookinfo and getBook but returns cover and ebook
   * @param bookId
   * Todo: get rid of this or getBookInfo or getBook
   */
  public getBookWithEBook(bookId) {
    return this.http.get(
        environment.gatewayBaseUrl + '/books/getBookWithEBook?id=' + bookId)
  }

  /**
   * Todo: delete or add getEbookFileLocation
   */

  /**
   * Todo: delete or add getEbookLocation
   */


}
