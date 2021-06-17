import {Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MenuController, PopoverController} from '@ionic/angular';
import {AnnotationOptionsComponent} from "./annotation-options/annotation-options.component";
import {ImageUtils} from "../../utils/image-utils";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-table-of-contents',
  templateUrl: './table-of-contents.component.html',
  styleUrls: ['./table-of-contents.component.scss'],
})
export class TableOfContentsComponent implements OnInit, OnChanges {
  @Input() toc: any;
  @Input() isLesson: boolean;
  @Input() rendition: any;
  @Input() bookmark: any;
  @Input() annotations: any;
  @Input() guestAnnotations: any;
  @Input() currentLocation: any;
  @Input() user;
  @Input() currentUser;
  @Input() deleteAnnotationEvent: EventEmitter<any>;
  @Input() navigateEvent: EventEmitter<any>;

  selectedContent = 0;
  selectedBookmark: number;
  segmentSelected: string;
  text: boolean = true;
  note: boolean = true;

  scrollbar = "::-webkit-scrollbar {width: 5px;}::-webkit-scrollbar-track {background: #fff;}::-webkit-scrollbar-track:hover {background: #f7f7f7;}::-webkit-scrollbar-thumb {background: #ccc;}::-webkit-scrollbar-thumb:hover { background: #888}.inner-scroll {scrollbar-width: thin}"
  showMyNotes: boolean = true;


  constructor(
      private menu: MenuController,
      public annotationOptions: PopoverController,
      private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.segmentSelected = this.isLesson ? 'notes' : 'toc';
  }

  getSelectedContent() {
    if(this.toc && this.currentLocation){
      this.toc.forEach((content, index) => {
        if(content.href === this.currentLocation.start.href){
          this.selectedContent = index;
        }
      })
    }
  }

  navigateSection(content, ind){
    this.selectedContent = ind;

    this.rendition.display(content.href);
  }

  close_menu(){
    this.menu.close('spine');
  }

  segmentChanged(ev: any) {
    this.segmentSelected = ev.detail.value;
  }

  async presentAnnotationOptions(ev: any, annotation) {
    const popover = await this.annotationOptions.create({
      component: AnnotationOptionsComponent,
      cssClass: 'annotation-list-options',
      mode: 'ios',
      event: ev,
    });
    await popover.present();

    return await popover.onDidDismiss().then((res:any) => {
      if(res.data){
        if(res.data.delete){
          this.deleteAnnotationEvent.emit(annotation)
        } else if (res.data.navigate){
          this.navigateEvent.emit(annotation)
        }
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.currentLocation && changes.currentLocation.currentValue) {
      this.currentLocation = changes.currentLocation.currentValue
      this.getSelectedContent();
    }
  }

  getImage(user) {
    return ImageUtils.decodeDBImage(this.sanitizer, ImageUtils.convertDBImage(user.profileimage));
  }
}
