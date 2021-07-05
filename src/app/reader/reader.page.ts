import {Component, OnInit, HostListener, EventEmitter} from '@angular/core';
import { MenuController, ModalController, NavController, PopoverController  } from '@ionic/angular';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { WordOptionsComponent } from '../shared/popover/word-options/word-options.component';
import { ImageModalPage } from '../modals/image-modal/image-modal.page';
import { ReaderControlsPage } from '../modals/reader-controls/reader-controls.page';
import { ReaderMetaService } from '../Providers/reader-meta/reader-meta.service';
import { AnnotationData } from '../Providers/reader-meta/model/annotationData';
import { Contents, EpubCFI } from 'epubjs';
import { ImageUtils } from '../utils/image-utils';
import { DomSanitizer } from '@angular/platform-browser';
import {FinishedReadingComponent} from './finished-reading/finished-reading.component';
import {LessonData} from '../Providers/lesson-services/lesson-services-models/lesson-data';
import {LessonService} from '../Providers/lesson-services/lesson.service';
import { User } from '../Providers/user-controller/model/users-model';


declare var ePub: any;

const ALPHA = 'aa';
const HIGHLIGHTYELLOW = '#ffff00' + ALPHA;

@Component({
  selector: 'app-reader',
  templateUrl: './reader.page.html',
  styleUrls: ['./reader.page.scss'],
})
export class ReaderPage implements OnInit {
  currentUser: User;
  teacher: User;
  isLesson = false;
  lessonId: number;
  lesson: LessonData;

  // book info
  bookId;
  bookMeta: any;

  //book settings
  highlightColor: any;
  currentBookmark: any;
  currentAnnotation: any;
  annotations: Array<AnnotationData>;
  teachersAnnotations: Array<AnnotationData>;
  startLoc = '';
  endLoc = '';
  currentTheme = 'light';

  // epubjs
  book: any;
  rendition: any;
  contents: Contents;
  currentLocation;
  toc: any[];

  // indicators
  isStudent: boolean;
  noBookSelected = false;
  loaded = false;
  isFloatMenuOpen: boolean;
  autoHighlight = false;
  autoDelete = false;
  detailPopoverOpen = false;
  showStudentAnnotations = true;
  showTeacherAnnotations = false;
  finishedSection = false;

  // events
  fontChangeEvent = new EventEmitter();
  colorSelectEvent = new EventEmitter();
  autoHighlightEvent = new EventEmitter();
  autoDeleteEvent = new EventEmitter();
  addHighlightEvent = new EventEmitter();
  updateHighlightEvent = new EventEmitter();
  deleteAnnotationEvent = new EventEmitter();

  annotationEvent = new EventEmitter();
  newAnnotationsEvent = new EventEmitter();
  navigateEvent = new EventEmitter();
  changeThemeEvent = new EventEmitter();


  constructor(
    private menu: MenuController,
    public modalController: ModalController,
    public popoverController: PopoverController,
    private route: ActivatedRoute,
    private location: Location,
    private navCtrl: NavController,
    private http: HttpClient,
    private readerMetaService: ReaderMetaService,
    private lessonService: LessonService,
    private sanitizer: DomSanitizer, ) {
   }

  ngOnInit() {
    this.rendition = '';

    this.bookId = this.route.snapshot.paramMap.get('bookId');

    this.route.queryParams.subscribe(params => {
      this.lessonId = params.lessonId;
    });

    if (this.lessonId) {
      this.isLesson = true;
    }

    if (this.bookId){
      if (this.lessonId) {
        this.getLesson();
      }
      else {
        this.setReaderMeta();
        this.setupEventSubscriptions();
      }
    } else {
      this.noBookSelected = true;
    }
  }

  getLesson(){
    this.lessonService.getLessonById(this.lessonId.toString()).subscribe((res) => {
      console.log(res);
      if (res){
        this.lesson = new LessonData(res);

        console.log(this.lesson);
        this.startLoc = res.start_page;

        if (res.end_page === 'end') {
          this.endLoc = res.end_page;
        }

        if (this.bookId === this.lesson.bookId.toString()) {
          this.setReaderMeta();
          this.setupEventSubscriptions();
          // TODO: change to use userId
          // this.getTeacherUser(res.creator);
        } else {
          this.noBookSelected = true;
        }
      }
    });
  }

  /**
   * Sets reader meta by either getting existing from DB or
   * creating new and pushing to DB
   */
  setReaderMeta() {
    const username = localStorage.getItem('logedInUsername');
    // TODO: change to use userId
    // this.userService.getUser(username).subscribe((res) => {
    //   this.currentUser = res;
    //   this.isStudent = res.roles[0].type === 'ROLE_STUDENT'

    //   if(this.currentUser) {
    //     this.readerMetaService.getReaderMeta(this.currentUser.username, this.bookId)
    //         .subscribe((res) => {
    //           if (res) {
    //             this.bookMeta = res;

    //             if(this.bookMeta.last_highlight_color)
    //               this.highlightColor = this.bookMeta.last_highlight_color;
    //             else
    //               this.highlightColor = HIGHLIGHTYELLOW + ALPHA;

    //             this.openBook();
    //           } else {
    //             this.readerMetaService.addReaderMeta({
    //               id: null,
    //               username: this.currentUser.username,
    //               book_id: this.bookId,
    //               highlight_color_id: -1,
    //               highlights_id: -1,
    //               notes_id: -1,
    //               font_family: 'Arial',
    //               font_size: 100,
    //               font_weight: "normal",
    //               font_style: "normal",
    //               last_location: "",
    //               last_highlight_color: "#EE3A23",
    //             }).subscribe((res) => {
    //               if(res) {
    //                 this.bookMeta = res;
    //                 this.highlightColor = this.bookMeta.last_highlight_color;
    //                 this.openBook();
    //               } else {
    //                 this.noBookSelected = true;
    //               }
    //             })
    //           }
    //         })
    //   }
    // });
  }

  /**
   * Gets teach/creator
   * @param username: typically creator of lesson
   */
  // TODO: change to use userId
  // getTeacherUser(username: string){
  //   this.userService.getUser(username).subscribe((res) => {
  //     if(res){
  //       this.teacher = res;
  //     }
  //   })
  // }

  /**
   * Initializes all subscriptions from children
   */
  setupEventSubscriptions() {
    this.fontChangeEvent.subscribe(data => {
      const fontSize = data ? this.bookMeta.font_size + 10 : this.bookMeta.font_size - 10;
      this.setFontSize(fontSize);
    });

    this.colorSelectEvent.subscribe(data => {
      if (data) {
        this.bookMeta = data;
        this.updateHighlightColor(this.bookMeta.last_highlight_color);
      }
    });

    this.autoHighlightEvent.subscribe(res => {
      if (res != null) {
        this.autoHighlight = res;
      }
    });

    this.autoDeleteEvent.subscribe(res => {
      if (res != null) {
        this.autoDelete = res;
      }
    });

    this.addHighlightEvent.subscribe(res => {
      res = JSON.parse(res);
      let teacherSetFalse = false;
      if (res) {
        res.data.text = this.getRange(res.cfiRange, this.contents).toString();
        if (this.showTeacherAnnotations){
          this.toggleTeacherAnnotationsView();
          this.showTeacherAnnotations = false;
          teacherSetFalse = true;
        }
        this.currentAnnotation = this.setHighlight(res.cfiRange, this.contents, res.data, this.highlightColor);
        this.currentAnnotation.data.creator = this.bookMeta.username;
        this.addAnnotations(this.currentAnnotation);

        if (teacherSetFalse){
          this.toggleTeacherAnnotationsView();
          this.showTeacherAnnotations = true;
        }
      }
    });

    this.updateHighlightEvent.subscribe(res => {
      if (res) {
        this.updateAnnotation(res);
        this.updateAnnotations();
      }
    });

    this.deleteAnnotationEvent.subscribe((data) => {
      if (data) {
        this.readerMetaService.deleteAnnotation(data.id, this.bookMeta.username, this.bookMeta.book_id)
            .subscribe((res: any) => {
              if (res) {
                this.removeHighlight(data.cfi_range, this.bookMeta.username);

                this.annotations = res.sort((an1, an2) => {
                  return this.rendition.epubcfi.compare(an1.cfi_range, an2.cfi_range);
                });
              } else {
                alert('Error deleting Annotation');
              }
            });
      } else {
        this.readerMetaService.deleteAnnotation(this.currentAnnotation.data.id, this.bookMeta.username, this.bookMeta.book_id)
            .subscribe((res: any) => {
              if (res) {
                this.removeHighlight(this.currentAnnotation.cfiRange, this.bookMeta.username);

                this.annotations = res.sort((an1, an2) => {
                  return this.rendition.epubcfi.compare(an1.cfi_range, an2.cfi_range);
                });
              } else {
                alert('Error deleting Annotation');
              }
            });
      }
    });

    this.navigateEvent.subscribe((data) => {
      this.bookMeta.last_location = data.cfi_range;
      this.saveMeta().subscribe((res) => {
        if (res) {
          this.rendition.display(res.last_location);
          this.currentLocation = this.rendition.currentLocation();
        }
      });
    });
  }

  /**
   * Open render epub book
   */
  openBook() {
    // create book from url
    this.book = ePub();
    this.http.get(environment.gatewayBaseUrl + '/books/getBookWithEBook?id=' + this.bookId).subscribe((data: any) => {
      if (data){
        this.noBookSelected = false;

        this.book.open(data.base64eBook, 'base64');
        this.rendition = this.book.renderTo('viewer', {
          width: '100%',
          height: '100%' ,
          ignoreClass: 'annotator-hl', // Not sure why this is used yet
        });

        // sets when to switch between single and multiple columns
        this.rendition.spread('none', 0);
        this.rendition.spread('auto', 1000);

        this.rendition.themes.register('dark', '/assets/Reader/Themes/themes.css');
        this.rendition.themes.register('light', '/assets/Reader/Themes/themes.css');

        this.setReaderSettings();

        this.setListeners();
      } else {
        this.noBookSelected = true;
      }
    });
  }

  /**
   * Set all book and rendition listeners
   */
  setListeners() {
    // Get all sections of the book
    this.book.loaded.navigation.then((toc) => {
      this.beginRendering(this.getToc(toc));
    });

    // Everytime the reader renders
    this.rendition.on('rendered', (section, view) => {
      this.updateHighlightColor(this.highlightColor);
      this.contents = view.contents;
      this.currentLocation = this.rendition.currentLocation();

      this.restoreTheme();

      this.loaded = true;
    });


    // Update when actually displayed
    this.rendition.on('displayed', () => {
      this.restoreAnnotations();
    });


    // To run on selection
    this.rendition.on('selected', (cfiRange: EpubCFI, contents: Contents) => {
      this.contents = contents;
      if (this.autoHighlight) {
        const text = this.getRange(cfiRange, this.contents).toString();
        this.currentAnnotation = this.setHighlight(cfiRange, contents, {text, creator: this.bookMeta.username}, null);
        this.addAnnotations(this.currentAnnotation);
      } else {
        this.currentAnnotation = null;
        this.textOptionsModal(cfiRange, contents).then(() => {});
      }
    });

    this.rendition.on('markClicked', (cfiRange, data) => {
      if (this.autoDelete && data.creator === this.bookMeta.username) {
        this.deleteAnnotation(cfiRange);
      } else {
        this.popoverOnHighlightClick(cfiRange);
      }
    });

    // To run on click for images
    this.rendition.on('click', (ev) => {
      if (ev.target.src){
        this.fullImageModal(ev.target.src).then(() => {});
      }
    });
  }

  /**
   * Render book selection
   * @param toc
   */
  beginRendering(toc) {
    if (this.startLoc){
      this.rendition.display(this.startLoc);
    } else if (this.bookMeta.last_location){
      this.rendition.display(this.bookMeta.last_location);
    } else{
      this.rendition.display();
    }

    this.toc = toc;
  }

  /**
   * Restore all reader settings
   */
  setReaderSettings(){
    this.setFontSize(this.bookMeta.font_size);
    this.setFontWeight(this.bookMeta.font_weight);
    this.setFontStyle(this.bookMeta.font_style);
    this.setFontFamily(this.bookMeta.font_family);

    // set selection
    this.rendition.themes.default({
      '::selection': {
        background: this.highlightColor
      },
    });
  }

  /**
   * Add highlight to annotations highlights and store
   * @param cfiRange: Range
   * @param contents: rendition contents
   * @param data: annotation data
   * @param color: annotation color
   */
  setHighlight(cfiRange, contents, data, color) {
    let highlightExists = false;

    if (this.showStudentAnnotations && this.showTeacherAnnotations) {
      this.rendition.annotations.highlights.forEach((ann) => {
        if (cfiRange === ann.cfiRange && data.username === this.bookMeta.username){
          highlightExists = true;
        }
      });
    }

    if (!highlightExists) {
      const annotation = this.rendition.annotations.add('highlight', cfiRange, data, () => {
      }, 'epubjs-hl', {fill: color ? color : this.highlightColor, 'mix-blend-mode': 'multiply'});

      this.rendition.annotations.highlights.push(annotation);

      contents.window.getSelection().removeAllRanges();

      return annotation;
    }

    return null;
  }

  /**
   * Updates highlight color and window selection color
   * @param color
   */
  updateHighlightColor(color) {
    this.highlightColor = color;

    this.rendition.themes.default({
      '::selection': {
        background: this.highlightColor
      },
    });
  }

  /**
   * Adds annotation to meta and on success adds to rendition
   * @param annotation
   */
  addAnnotations(annotation) {
    this.readerMetaService.addAnnotation({
      id: null,
      username: this.bookMeta.username,
      book_id: this.bookMeta.book_id,
      cfi_range: annotation.cfiRange,
      note: annotation.data.note ? annotation.data.note : '',
      fill: annotation.styles.fill,
      definition: annotation.data.definition ? annotation.data.definition : '',
      text: annotation.data.text,
      public_access: annotation.data.public_access
    }).subscribe((res: Array<AnnotationData>) => {
      if (res) {
        this.annotations = res.sort((an1, an2) => {
          return this.rendition.epubcfi.compare(an1.cfi_range, an2.cfi_range);
        });

        this.newAnnotationsEvent.emit(res);

        res.forEach((an) => {
          if (an.cfi_range === annotation.cfiRange) {
            this.rendition.annotations.highlights.forEach((highlight) => {
              if (an.cfi_range === highlight.cfiRange && highlight.data.creator === this.bookMeta.username) {
                highlight.data.id = an.id;
                this.currentAnnotation = highlight;

                this.annotationEvent.emit(this.currentAnnotation);
              }
            });
          }
        });

        this.restoreVisible();
      }
    });
  }

  /**
   * Restore all annotations from DB
   */
  restoreAnnotations() {
    this.rendition.annotations.highlights.forEach((annotation => {
      this.rendition.annotations.remove(annotation.cfiRange, 'highlight');
    }));

    this.readerMetaService.getAnnotations(this.bookMeta.username, this.bookMeta.book_id)
      .subscribe((res: Array<AnnotationData>) => {
        if (res) {
          this.annotations = res.sort((an1, an2) => {
            return this.rendition.epubcfi.compare(an1.cfi_range, an2.cfi_range);
          });

          res.forEach((annotation) => {
            this.setHighlight(annotation.cfi_range, this.contents, {
              note: annotation.note,
              definition: annotation.definition,
              id: annotation.id,
              creator: annotation.username,
              public_access: annotation.public_access
            }, annotation.fill);
          });
        }
      });

    if (this.teacher) {
      this.readerMetaService.getTeacherAnnotations(this.teacher.username, this.bookMeta.book_id)
        .subscribe((res: Array<AnnotationData>) => {
          if (res.length > 0) {
            this.teachersAnnotations = res;
          }
        });
    }
  }

  /**
   * Mainly used for annotation note updates
   */
  updateAnnotations() {
    this.readerMetaService.getAnnotations(this.bookMeta.username, this.bookMeta.book_id)
      .subscribe((res: Array<AnnotationData>) => {
        if (res) {
          this.annotations = res.sort( (an1, an2) => {
            return this.rendition.epubcfi.compare(an1.cfi_range, an2.cfi_range);
          });

          res.forEach((annotation) => {
            this.rendition.annotations.highlights.forEach((highlight) => {
              if (annotation.cfi_range === highlight.cfiRange && annotation.username === highlight.data.creator) {
                highlight.data.note = annotation.note;
                highlight.data.public_access = annotation.public_access;
              }
            });
          });
        }
      });
  }

  updateAnnotation(annotation){
    this.readerMetaService.updateAnnotation({
      id: annotation.data.id,
      username: this.bookMeta.username,
      book_id: this.bookMeta.book_id,
      cfi_range: annotation.cfiRange,
      note: annotation.data.note ? annotation.data.note : '',
      fill: annotation.styles.fill,
      definition: annotation.data.definition ? annotation.data.definition : '',
      text: this.getRange(annotation.cfiRange, this.contents).toString(),
      public_access: annotation.data.public_access
    }).subscribe((res) => {
      if (!res) {
        alert('Error updating annotation');
      }
    });
  }

  /**
   * Delete a given annotation
   * @param cfiRange: string cfiRange
   */
  deleteAnnotation(cfiRange) {
    let annotation;

    this.rendition.annotations.highlights.forEach((highlight) => {
      if (cfiRange === highlight.cfiRange) {
        annotation = highlight;
      }
    });

    if (annotation && annotation.data.creator === this.bookMeta.username) {
      this.readerMetaService.deleteAnnotation(annotation.data.id, this.bookMeta.username, this.bookMeta.book_id)
          .subscribe((res: Array<AnnotationData>) => {
            if (res) {
              this.annotations = res.sort((an1, an2) => {
                return this.rendition.epubcfi.compare(an1.cfi_range, an2.cfi_range);
              });

              this.removeHighlight(cfiRange, this.bookMeta.username);
            } else {
              alert('Error deleting Annotation');
            }
          });
    }
  }

  /**
   * Removes highlights from rendition
   *
   * @param cfiRange: highlight cfiRange
   * @param user: the user whos highlights to remove.
   */
  removeHighlight(cfiRange, user) {
    if (cfiRange) {
      // removes actual annotation
      this.rendition.annotations.remove(cfiRange, 'highlight');

      // removes item from highlight array used for easier categorization (may be removed in future)
      const ind = -1;
      this.rendition.annotations.highlights.forEach((highlight, index) => {
        if (cfiRange === highlight.cfiRange && highlight.data.creator === user) {
          this.rendition.annotations.highlights.splice(ind, 1);

          // set current annotation to null if removed
          if (this.currentAnnotation) {
            if (highlight.data.creator === this.currentAnnotation.data.creator){
              this.currentAnnotation = null;
            }
          }
        }
      });
    }
  }

  /**
   * Resize by deleting and updating.
   * May be quicker way. This is easy.
   * Relies on highlights being manually added to annotations.highlights
   */
  resizeHighlights(){
    for (const highlight of this.rendition.annotations.highlights) {
      this.rendition.annotations.remove(highlight.cfiRange, 'highlight');
      this.rendition.annotations.highlight(highlight.cfiRange, highlight.data, highlight.cb, highlight.className, highlight.styles);
    }
  }

  /**
   * Modal for reader quick access controls
   */
  async presentReaderControlsModal() {
      const modal = await this.modalController.create({
        component: ReaderControlsPage,
        cssClass: 'options-card',
        showBackdrop: false,
        componentProps: {
          readerMeta: this.bookMeta,
          autoHighlight: this.autoHighlight,
          autoDelete: this.autoDelete,
          fontChangeEvent: this.fontChangeEvent,
          colorSelectEvent: this.colorSelectEvent,
          autoHighlightEvent: this.autoHighlightEvent,
          autoDeleteEvent: this.autoDeleteEvent
        }
      });

      await modal.present();
      await modal.onDidDismiss().then(() => {
        this.isFloatMenuOpen = false;
      });
  }

  /**
   * Modal for displaying image at full scale
   * @param src source of image to present
   */
  async fullImageModal(src: string) {
    const modal = await this.modalController.create({
      component: ImageModalPage,
      cssClass: 'image-modal',
      componentProps: {
        src
      }
    });
    return await modal.present();
  }

  /**
   * Modal for handling text selections
   * @param range  epubCfi to convert to range
   * @param contents rendition contents
   */
  async textOptionsModal(range: any, contents: any) {
    const rng = this.getRange(range, contents);
    const user = this.getUserForNote(range);

    if (!this.detailPopoverOpen) {
      this.detailPopoverOpen = true;
      const popover = await this.popoverController.create({
        component: WordOptionsComponent,
        translucent: true,
        componentProps: {
          range: rng,
          cfiRange: range,
          readerMeta: this.bookMeta,
          teacher: this.lesson ? this.lesson.creator : null,
          user,
          currentUser: this.currentUser,
          ownsNote: user ?  user.username === this.currentUser.username : false,
          isStudent: this.isStudent,
          annotationEvent: this.annotationEvent,
          annotation: this.currentAnnotation,
          addHighlightEvent: this.addHighlightEvent,
          updateHighlightEvent: this.updateHighlightEvent,
          deleteAnnotationEvent: this.deleteAnnotationEvent
        },
        cssClass: 'word-options'
      });
      await popover.present();

      return popover.onDidDismiss().then(() => {
        if (contents.window.getSelection()) {
          contents.window.getSelection().removeAllRanges();
        }
        this.detailPopoverOpen = false;
        this.updateAnnotations();
      });
    }
  }

  /**
   * Given a range, get owner.
   * If student and teacher have same range default to teacher.
   * @param range: cfiRange
   */
  getUserForNote(range){
    let user = null;

    if (this.showTeacherAnnotations) {
      this.teachersAnnotations.forEach((annotation) => {
        if (annotation.cfi_range === range) {
          user = this.teacher;
        }
      });
    }

    if (this.showStudentAnnotations) {
      this.annotations.forEach((annotation) => {
        if (annotation.cfi_range === range){
          user = this.currentUser;
        }
      });
    }

    return user;
  }

  /**
   * Gets annotations from svg and displays in text options modal
   * @param cfiRange
   */
  popoverOnHighlightClick(cfiRange) {
    this.rendition.annotations.highlights.forEach((highlight) => {
      if (highlight.cfiRange === cfiRange){
        this.currentAnnotation = highlight;
        this.textOptionsModal(cfiRange, this.contents).then();
      }
    });
  }

  /**
   *  Used instead of book.getRange to resolve issues with wrong document.
   */
  getRange(cfiRange: any, contents: any) {
    const cfi = new EpubCFI(cfiRange);

    return cfi.toRange(contents.document);
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

  /**
   * Opens TOC menu
   */
  openToc() {
    this.menu.enable(true, 'spine').then();
    this.menu.open('spine').then();
  }


  /**
   * Rendition next page
   */
  next() {
    this.rendition.next().then(() => {
      this.resizeHighlights();

      this.saveLastLocation();

      // determines if we have reached end
      if (this.endLoc){
        if (this.rendition.epubcfi.isCfiString(this.endLoc)) {
          if (this.rendition.epubcfi.compare(this.rendition.currentLocation().start.cfi, this.endLoc) > 0) {
            this.presentFinishedReadingModal().then();
            this.finishedSection = true;
          }
        } else {
          if (this.rendition.currentLocation().start.href === this.endLoc) {
            this.presentFinishedReadingModal().then();
            this.finishedSection = true;
          }
        }
      }
    });
  }

  async presentFinishedReadingModal() {
    const modal = await this.modalController.create({
      component: FinishedReadingComponent,
      cssClass: 'finished-reading-modal',
      backdropDismiss: false,
    });
    await modal.present();

    return await modal.onDidDismiss().then((res) => {
      if (res) {
        if (res.data.finished){
          this.location.back();
        } else {
          this.isLesson = false;
          this.startLoc = null;
          this.endLoc = null;
        }
      }
    });
  }

  /**
   * Rendition previous page
   */
  prev() {
    this.rendition.prev().then(() => {
      this.resizeHighlights();

      this.saveLastLocation();

      // determines if we have reached end
      if (this.startLoc){
        if (this.rendition.epubcfi.isCfiString(this.startLoc)) {
          if (this.rendition.epubcfi.compare(this.rendition.currentLocation().end.cfi, this.startLoc) > 0) {
            this.rendition.next();
          }
        } else {
          if (this.rendition.currentLocation().end.href !== this.startLoc) {
            this.rendition.next();
          }
        }
      }
    });
  }

  /* Book Settings */

  /**
   * Updates meta with new font size and sets reader font size on success
   * @param size
   */
  setFontSize(size: number){
    if (this.bookMeta.font_size != size) {
      this.bookMeta.font_size = size;
      this.saveMeta().subscribe((res) => {
        if (res) {
          this.rendition.themes.fontSize(this.bookMeta.font_size + '%');
          this.resizeHighlights();
        }
      });
    }
  }

  setFontWeight(weight: string){
    if (this.bookMeta.font_weight != weight) {
      this.bookMeta.font_weight = weight;

      this.saveMeta().subscribe((res) => {
        if (res) {
          this.rendition.themes.default({
            div: {
              'font-weight': weight
            },
            h1: {
              'font-weight': weight
            },
            p: {
              'font-weight': weight
            }
          });
          this.resizeHighlights();
        }
      });
    }
  }

  setFontStyle(style: string) {
    if (this.bookMeta.font_style != style) {
      this.bookMeta.font_style = style;

      this.saveMeta().subscribe((res) => {
        if (res) {
          this.rendition.themes.default({
            div: {
              'font-style': style
            },
            h1: {
              'font-style': style
            },
            p: {
              'font-style': style
            }
          });

          this.resizeHighlights();
        }
      });
    }
  }

  setFontFamily(family){
    if (this.bookMeta.font_family != family) {
      this.bookMeta.font_family = family;

      this.saveMeta().subscribe((res) => {
        if (res) {
          this.rendition.themes.default({
            div: {
              'font-family': family
            },
            h1: {
              'font-family': family
            },
            p: {
              'font-family': family
            }
          });

          this.resizeHighlights();
        }
      });
    }
  }

  /**
   * Save last location
   */
  saveLastLocation() {
    this.currentLocation = this.rendition.currentLocation();

    this.bookMeta.last_location = this.currentLocation.start.cfi;

    this.saveMeta().subscribe(() => {});
  }

  /* utility */

  toggleFloatMenu() {
    this.isFloatMenuOpen = true;
    this.presentReaderControlsModal().then(() => {});
  }

  saveMeta(){
    return this.readerMetaService.updateReaderMeta(this.bookMeta);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.loaded = false;
  }

  openSettings() {
    this.menu.enable(true, 'settings').then();
    this.menu.open('settings').then();
  }

  getImage(profileImage: string) {
    return ImageUtils.decodeDBImage(this.sanitizer, ImageUtils.convertDBImage(profileImage));
  }

  /**
   * Add or remove student annotations
   */
  toggleStudentAnnotationsView() {
    if (this.showStudentAnnotations) {
      this.showStudentAnnotations = false;
      this.hideHighlights(this.annotations, this.bookMeta.username);
    }
    else{
      this.showStudentAnnotations = true;
      this.showHighlights(this.annotations);
    }
  }

  /**
   * Add or remove teacher annotations
   */
  toggleTeacherAnnotationsView() {
    if (this.showTeacherAnnotations) {
      this.showTeacherAnnotations = false;
      this.hideHighlights(this.teachersAnnotations, this.teacher.username);
    }
    else{
      this.showTeacherAnnotations = true;
      this.showHighlights(this.teachersAnnotations);
    }
  }

  /**
   * Adds annotations back to rendition
   * @param annotations: annotations to add
   */
  showHighlights(annotations: Array<AnnotationData>){
    annotations.forEach((annotation) => {
      let add = true;

      if (this.showTeacherAnnotations && this.showStudentAnnotations) {
        this.rendition.annotations.highlights.forEach((ann) => {
          if (annotation.cfi_range === ann.cfiRange) {
            add = false;
          }
        });
      }

      if (add){
        this.setHighlight(annotation.cfi_range, this.contents, {
          note: annotation.note,
          definition: annotation.definition,
          id: annotation.id,
          creator: annotation.username,
          public_access: annotation.public_access
        }, annotation.fill);
      }
    });
  }

  /**
   * Removes all given annotations from rendition.
   * @param annotations: annotations to remove
   */
  hideHighlights(annotations: Array<AnnotationData>, user){
    if (annotations) {
      annotations.forEach((annotation) => {

        if (this.showTeacherAnnotations && !this.showStudentAnnotations) {
          this.removeHighlight(annotation.cfi_range, user);

          // add teacher highlight if student with same cfiRange is removed
          if (this.teachersAnnotations) {
            this.teachersAnnotations.forEach((ann) => {
              if (annotation.cfi_range === ann.cfi_range) {
                this.setHighlight(ann.cfi_range, this.contents, {
                  note: ann.note,
                  definition: ann.definition,
                  id: ann.id,
                  creator: ann.username,
                  public_access: ann.public_access
                }, annotation.fill);
              }
            });
          }
        } else if (!this.showTeacherAnnotations && this.showStudentAnnotations) {
          let deleteAnn = true;
          this.annotations.forEach((ann) => {
            if (annotation.cfi_range === ann.cfi_range) {
              deleteAnn = false;
            }
          });

          if (deleteAnn) {
            this.removeHighlight(annotation.cfi_range, user);
          }
        } else {
          this.removeHighlight(annotation.cfi_range, user);
        }
      });
    } else {
      console.log('Annotation list undefined');
    }
  }

  restoreVisible(){
    if (!this.showStudentAnnotations) {
      this.hideHighlights(this.annotations, this.bookMeta.username);
    }

    if (this.teacher && !this.showTeacherAnnotations) {
      this.hideHighlights(this.teachersAnnotations, this.teacher.username);
    }
  }

  changeTheme(ev) {
    this.currentTheme = ev;
    if (ev === 'dark') {
      this.rendition.themes.default({ body: { background: '#121212', color: '#fff'}});
      this.rendition.themes.select('dark');
    }else if (ev === 'light'){
      this.rendition.themes.default({ body: { background: '#fff'}});
      this.rendition.themes.select('light');
    }
  }

  restoreTheme(){
    if (this.currentTheme === 'dark') {
      this.rendition.themes.default({ body: { background: '#121212', color: '#fff'}});
      this.rendition.themes.select('dark');
    }else if (this.currentTheme === 'light'){
      this.rendition.themes.default({ body: { background: '#fff'}});
      this.rendition.themes.select('light');
    }
  }

  finishedReading() {
    this.location.back();
  }

    goBack() {
        this.navCtrl.back();
    }
}
