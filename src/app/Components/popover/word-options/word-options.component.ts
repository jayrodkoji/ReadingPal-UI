import {Component, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import { PopoverController } from "@ionic/angular";
import {ReaderMetaService} from "../../../Providers/reader-meta/reader-meta.service";
import {EventEmitter} from "events";
import {DictionaryControllerService} from "../../../Providers/dictionary-controller/dictionary-controller.service";
import {ImageUtils} from "../../../rp-utils/image-utils";
import {DomSanitizer} from "@angular/platform-browser";
import {Message} from "../../../Providers/messages-controller/model/message";
import {MessagesService} from "../../../Providers/messages-controller/messages.service";

@Component({
  selector: 'app-word-options',
  templateUrl: './word-options.component.html',
  styleUrls: ['./word-options.component.scss'],
})
export class WordOptionsComponent implements OnInit {
  @Input() range;
  @Input() readerMeta;
  @Input() annotationEvent;
  @Input() annotation;
  @Input() cfiRange;
  @Input() teacher;
  @Input() user;
  @Input() currentUser;
  @Input() ownsNote;
  @Input() isStudent;
  @Output() addHighlightEvent = new EventEmitter();
  @Output() updateHighlightEvent = new EventEmitter();
  @Output() deleteAnnotationEvent = new EventEmitter();

  highlighted: boolean = false;
  highlightColor: string;
  showNote: boolean = true;
  annotation_id;
  messageData: Message;
  data = {
    creator: null,
    note: '',
    highlightedText: '',
    definition: '',
    public_access: false,
  }

  private hasDefinition: boolean = false;
  private defLoading: boolean;
  askQuestion: boolean = false;
  currentQuestion: string;

  constructor(
      private popover: PopoverController,
      private dictionaryService: DictionaryControllerService,
      private popoverController: PopoverController,
      private readerMetaService: ReaderMetaService,
      private messagesService: MessagesService,
      private sanitizer: DomSanitizer,
  ) {
  }

  ngOnInit() {
    if (this.annotation) {
      this.restoreData();
      this.getDefinition();

      if (!this.ownsNote && this.annotation) {
        this.highlighted = false;
      }
    } else {
      this.ownsNote = true;

      if (!this.user) {
        this.user = this.currentUser;
      }
    }

    this.annotationEvent.subscribe((data) => {
      if(data) {
        this.annotation = data;

        this.restoreData();
        this.getDefinition();
      }
    })
  }

  /**
   * Restore all values from readerMeta and annotation
   */
  restoreData() {
    this.highlightColor = this.readerMeta.last_highlight_color;

    this.highlighted = true;

    if (this.annotation.data.note) {
      this.data.note = this.annotation.data.note;
      this.showNote = true;
    }
    if (this.annotation.data.fill)
      this.data.highlightedText = this.annotation.data.fill;
    if (this.annotation.data.definition) {
      this.data.definition = this.annotation.data.definition;
      this.hasDefinition = true;
    }
    if(this.annotation.data.public_access)
      this.data.public_access = this.annotation.data.public_access

    this.buildMessageData();
  }

  /**
   * If single word and no definition gets definition from api
   */
  getDefinition() {
    this.defLoading = true;
    if (this.isSingleWord() && !this.data.definition) {
      this.dictionaryService.lookupWord(this.range.toString())
          .subscribe(
              data => {
                if (data && typeof data[0] !== 'string') {
                  this.data.definition = JSON.stringify(data);
                  this.defLoading = false;
                  this.hasDefinition = true;
                } else {
                  this.defLoading = false;
                }
              })
    } else {
      this.defLoading = false;
    }
  }

  buildMessageData(){
    this.messageData = new Message()

    this.messageData.student_username = this.currentUser.username;
    this.messageData.user_role = this.currentUser.roles[0].type;
    this.messageData.teacher_username = this.teacher;
    this.messageData.book_id = this.readerMeta.book_id;
    this.messageData.annotation_id = this.annotation.data.id;
  }

  /**
   *   Checks selected for dictionary compatibility (single word)
   */
  isSingleWord(): boolean {
    if (this.range)
      return this.range.toString().match(/[^ ]+/g) && this.range.toString().match(/[^ ]+/g).length == 1;

    return false;
  }

  /**
   * Updates DB with when submitted
   */
  updateAnnotation() {
    if(!this.highlighted) {
      this.highlighted = !this.highlighted;
      if (this.readerMeta) {
        this.data.creator = this.readerMeta.username;

        this.ownsNote = true;
        this.addHighlightEvent.emit(JSON.stringify({cfiRange: this.cfiRange, data: this.data}));
      }
    }

    this.annotation.data.note = this.data.note;
    this.annotation.data.definition =  this.data.definition;
    this.annotation.data.public_access = this.data.public_access;
    this.updateHighlightEvent.emit(this.annotation);
    this.closePopover();
  }

  /**
   * Adds or removes annotation depending on selection
   */
  editHighlight() {
    this.highlighted = !this.highlighted;

    if (this.highlighted) {
      if(this.readerMeta) {
        this.data.creator = this.readerMeta.username;

        this.ownsNote = true;
        this.addHighlightEvent.emit(JSON.stringify({cfiRange: this.cfiRange, data: this.data}));
      }
    } else {
      this.deleteAnnotationEvent.emit(null);
      this.closePopover();
    }
  }

  getImage(user) {
    return ImageUtils.decodeDBImage(this.sanitizer, ImageUtils.convertDBImage(user.profileimage));
  }

  closePopover() {
    this.popover.dismiss();
  }

  handleHasMessage() {
    this.askQuestion = true;
  }
}
