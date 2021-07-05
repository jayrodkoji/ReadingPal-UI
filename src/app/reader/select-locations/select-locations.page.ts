import { HttpClient } from '@angular/common/http';
import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Book } from 'epubjs';
import { environment } from 'src/environments/environment';

declare var ePub: any;

@Component({
  selector: 'app-select-locations',
  templateUrl: './select-locations.page.html',
  styleUrls: ['./select-locations.page.scss'],
})
export class SelectLocationsPage implements OnInit, OnDestroy {
  @Input() bookId: string;
  book: Book;                  // required for epubjs
  rendition: any;             // required for epubjs
  currentLocation;            // current displayed location
  toc: any[];                 // contains table of contents

  loaded = false;             // used for loading spinner
  // To be set up when we implement start/end locations
  startLoc: string;
  endLoc: string;
  segmentSelected: string;
  selectedContent: any;

  constructor(
    public modalController: ModalController,
    private navCtrl: NavController,
    private http: HttpClient ) {
   }

  ngOnInit() {
    this.rendition = '';
    this.segmentSelected = 'toc';

    if (this.bookId){
      this.openBook();
    } else {
    }

    const select: any = document.querySelector('.custom-options');
    select.interfaceOptions = {
      cssClass: 'select-lesson-navigation'
    };

  }

  ngOnDestroy(): void {
    this.book.destroy();
  }

  openBook() {
    // create book from url
    this.book = ePub();
    this.http.get(environment.gatewayBaseUrl + '/books/getBookWithEBook?id=' + this.bookId).subscribe((data: any) => {
      this.book.open(data.base64eBook, 'base64');
      this.rendition = this.book.renderTo('viewer', {
        width: '100%',
        height: '100%'
      });

      this.setListeners();
    });
  }

  /**
   * Set all book and rendition listeners
   */
  setListeners() {
    // get all sections of the book
    this.book.loaded.navigation.then((toc) => {
      this.beginRendering(this.getToc(toc));
    });

    this.rendition.on('rendered', () => {

      this.currentLocation = this.rendition.currentLocation();

      this.loaded = true;
    });
  }

  setStartLocation(){
    const tempLoc = this.rendition.currentLocation().start.cfi;
    if (tempLoc && this.endLoc){
      if (this.rendition.epubcfi.compare(tempLoc, this.endLoc) > 0) {
        alert('Start location must be before end location.');
        this.startLoc = null;
      } else {
        this.startLoc = tempLoc;
      }
    } else if (tempLoc) {
      this.startLoc  = tempLoc;
    }
  }

  setEndLocation(){
    const tempLoc = this.rendition.currentLocation().end.cfi;
    if (tempLoc && this.startLoc){
      if (this.rendition.epubcfi.compare(tempLoc, this.startLoc) < 0) {
        alert('End location must be before end location.');
        this.endLoc = null;
      } else {
        this.endLoc  = tempLoc;
      }
    } else if (tempLoc) {
      this.endLoc  = tempLoc;
    }
  }

  submit() {
    this.book.destroy();

    this.modalController.dismiss({
      submit: true,
      startLoc: this.startLoc,
      endLoc : this.endLoc
    });
  }

  dismiss() {
    this.book.destroy();

    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      submit: false,
    });
  }

  /**
   * Get each Table of Contents item
   * @param toc table of contents
   */
  getToc(toc) {
    let sections = [];
    if (toc.length){
      toc.forEach((section) => {
        sections.push(section);

        // uses recusion for oddly nested epubs
        sections = sections.concat(this.getToc(section.subitems));
      });
    }

    return sections;
  }

  beginRendering(toc) {
    if (this.startLoc){
      this.rendition.display(this.startLoc);
    } else{
      this.rendition.display();
    }

    this.toc = toc;
  }

  next() {
    this.rendition.next();
  }

  prev() {
    this.rendition.prev();
  }

  goBack() {
    this.navCtrl.back();
  }

  navigateSection(ev){
    try {
      this.rendition.display(ev.detail.value.href);
    } catch (e) {
      console.log('Error navigating to book location', e);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.loaded = false;
  }
}

