import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GetBooksService } from '../../../Providers/books/get-books.service';
import { Book } from '../../../Providers/books/books-service-models/book';
import { FileUploader } from 'ng2-file-upload';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';



declare var ePub: any;

@Component({
  selector: 'app-add-book-modal',
  templateUrl: './add-book-modal.component.html',
  styleUrls: ['./add-book-modal.component.scss'],
})
export class AddBookModalComponent implements OnInit {
  @Input() book;

  private inputMode = 'load';
  private bookFile: any;
  private cover;
  private sentences;
  private bookPath: any;

  private indexes = ['Flesch Age', 'Flesch-Kincaid', 'Fog', 'Automated Readability'];

  public uploader: FileUploader = new FileUploader({});
  public hasBaseDropZoneOver = false;
  private epubBook: any;

  syllable = require('syllable');

  private flesch: number;
  private fleshAge: number;
  private fleschKincaid: number;
  private gunningFog: number;
  private ari: number;
  private inputModeEl;

  constructor(
    private bookService: GetBooksService,
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer,
    private http: HttpClient) { }

  ngOnInit() {
    if (!this.book) {
      console.log(this.book);
      this.book = new Book();
      this.book.level = 0;
    }

    this.inputModeEl = document.getElementById('input-mode');
  }

  saveBook(book: any) {

    if (book.id) {
      console.log('update', book);
      this.bookService.updateBook(book);
    } else {
      console.log('save', book);
      this.bookService.addBook(book);
    }

    this.closeModal();
  }

  closeModal() {
    if (this.epubBook) {
      this.epubBook.destroy();
    }

    return this.modalCtrl.dismiss();
  }

  updateInputMode(event: any) {
    this.inputMode = event.detail.value;
  }

  /*** File Upload Section ***/

  addedDropBook(ev) {
    this.bookFile = ev[0];
    this.addEbook();
    this.getBookInfo();

    this.inputModeEl.setAttribute('value', 'customize');
    this.inputMode = 'customize';
  }


  addedBrowseBook(ev) {
    if (ev.target.files[0]) {
      this.bookFile = ev.target.files[0];
    }
    this.addEbook();


    this.getBookInfo();

    this.inputModeEl.setAttribute('value', 'customize');
    this.inputMode = 'customize';
  }

  addEbook() {
    if (this.bookFile) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoadedEpub.bind(this);
      reader.readAsBinaryString(this.bookFile);
    }
  }

  handleReaderLoadedEpub(readerEvt) {
    const binaryString = readerEvt.target.result;
    this.book.base64eBook = btoa(binaryString);
  }

  getBookInfo() {
    this.epubBook = ePub(this.bookFile);

    this.epubBook.coverUrl().then((res) => {
      this.cover = this.sanitizer.bypassSecurityTrustResourceUrl(res);

      this.http.get(res, { responseType: 'blob' })
        .subscribe(
          result => {
            const reader = new FileReader();
            reader.onload = this.handleReaderLoadedCoverImage.bind(this);
            reader.readAsBinaryString(result);
          }
        );
    });

    this.epubBook.loaded.metadata.then((meta) => {
      this.book.title = meta.title;
      this.book.author = meta.creator;
      this.book.shortDescription = meta.description;
    });

    this.epubBook.loaded.navigation.then((toc) => {
      const tocList = this.getToc(toc);

      /**** Get reading level  ****/

      // has to render to get cfi
      const rendition = this.epubBook.renderTo('viewer', {
        height: '0%'
      });

      const randomSection = this.getAnalysisSectionInd(tocList);

      let text = '';

      // display random location
      rendition.display(tocList[randomSection].href);

      rendition.on('rendered', () => {
        text = text + '' + rendition.getContents()[0].content.textContent;

        this.sentences = text.match(/[^\.!\?]+[\.!\?]+/g);

        this.flesch = this.getFleschIndex();
        this.fleshAge = 20 - Math.floor(this.flesch / 10);
        this.fleschKincaid = this.getFleschKincaidIndex();
        this.gunningFog = this.getGunningFog();
        this.ari = this.getARI();
      });
    });
  }

  private getAnalysisSectionInd(tocList) {
    // get random section between chapter 1/3 in and second to last chapter
    const max = tocList.length - 2;
    const min = (tocList.length - 1) / 3;
    return Math.ceil(Math.random() * (max - min) + min);
  }

  getFleschIndex() {
    let numWords = 0;
    let numSyll = 0;
    let asl = 0;
    let asw = 0;

    for (const sentence of this.sentences) {
      for (const word of sentence.split(' ')) {
        numWords++;
        numSyll += this.syllable(word);
      }
    }

    asl = numWords / this.sentences.length;
    asw = numSyll / numWords;

    return parseInt((206.835 - (1.015 * asl) - (84.6 * asw)).toFixed(2), 10);
  }

  getFleschKincaidIndex() {
    let numWords = 0;
    let numSyll = 0;
    let asl = 0;
    let asw = 0;

    for (const sentence of this.sentences) {
      for (const word of sentence.split(' ')) {
        numWords++;
        numSyll += this.syllable(word);
      }
    }

    asl = numWords / this.sentences.length;
    asw = numSyll / numWords;

    return parseInt(((0.39 * asl) + (11.8 * asw) - 15.59).toFixed(2), 10);
  }

  getGunningFog() {
    let numWords = 0;
    let hw = 0;
    let asl = 0;
    let phw = 0;

    for (const sentence of this.sentences) {
      for (const word of sentence.split(' ')) {
        numWords++;

        const syllCount = this.syllable(word);

        // TODO: Implement spacy for the following rule:
        //  Count the number of words of three or more syllables that are NOT (i) proper nouns,
        //  (ii) combinations of easy words or hyphenated words
        if (syllCount >= 3) {
          hw += syllCount;
        }
      }
    }

    asl = numWords / this.sentences.length;
    phw = hw / numWords;

    return parseInt((0.4 * (asl + phw)).toFixed(2), 10);
  }

  getARI() {
    let numWords = 0;
    let numChars = 0;
    let charsDivWords = 0;
    let wordsDivSents = 0;

    for (const sentence of this.sentences) {
      for (const word of sentence.split(' ')) {
        numWords++;
        numChars += word.length;
      }
    }

    charsDivWords = numChars / numWords;
    wordsDivSents = numWords / this.sentences.length;

    // The Automated Readability Index (ARI)
    return parseInt((4.71 * charsDivWords + 0.5 * wordsDivSents - 21.43).toFixed(2), 10);
  }

  handleReaderLoadedCoverImage(readerEvt) {
    const binaryString = readerEvt.target.result;
    this.book.base64Cover = btoa(binaryString);
    this.cover = this.getCover();
  }

  /**
   * Get each Table of Contents item
   * @param toc table of contents
   */
  getToc(toc) {
    let sections = [];
    if (toc.length) {
      toc.forEach((section) => {
        sections.push(section);

        // uses recusion for oddly nested epubs
        sections = sections.concat(this.getToc(section.subitems));
      });
    }

    return sections;
  }


  getCover() {
    if (this.book.base64Cover) {
      return 'data:image/png;base64,'
        + (this.sanitizer.bypassSecurityTrustResourceUrl(this.book.base64Cover) as any).changingThisBreaksApplicationSecurity;
    }
  }


  getIndex(ind: any) {
    if (this.sentences) {
      switch (ind) {
        case 'Flesch Age':
          return this.fleshAge;
        case 'Flesch-Kincaid':
          return this.fleschKincaid;
        case 'Fog':
          return this.gunningFog;
        case 'Automated Readability':
          return this.ari;
      }
    }
  }

  browseEmptyImage() {
    const upload = document.getElementById('empty-upload');
    if (upload) {
      upload.click();
    }
  }

  browseExistingImage() {
    const upload = document.getElementById('exist-upload');
    if (upload) {
      upload.click();
    }
  }

  getImage(ev) {
    const reader = new FileReader();
    reader.onload = this.handleReaderLoadedCoverImage.bind(this);
    reader.readAsBinaryString(ev.target.files[0]);
  }

  browseBooks() {
    const upload = document.getElementById('book-input');
    if (upload) {
      upload.click();
    }
  }

  getBook(ev) {
    const reader = new FileReader();
    reader.onload = this.handleReaderLoadedEpub.bind(this);
    reader.readAsBinaryString(ev.target.files[0]);

    if (ev.target.files && ev.target.files[0].name) {
      this.bookPath = ev.target.files[0].name;
    }
  }


  hasAllFields() {
    return this.book.level && this.book.base64Cover && this.book.base64eBook && this.book.title &&
      this.book.author && this.book.shortDescription;
  }
}
