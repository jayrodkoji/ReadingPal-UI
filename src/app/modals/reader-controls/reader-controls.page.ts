import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ColorSelectPage } from 'src/app/shared/popover/color-select/color-select.page';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-reader-controls',
  templateUrl: './reader-controls.page.html',
  styleUrls: ['./reader-controls.page.scss'],
})
export class ReaderControlsPage implements OnInit {
  @Input('readerMeta') readerMeta;
  @Input('autoHighlight') autoHighlight;
  @Input('autoDelete') autoDelete;
  @Input('favoriteColors') favoriteColors;
  @Output() fontChangeEvent = new EventEmitter<any>();
  @Output() colorSelectEvent = new EventEmitter<any>();
  @Output() autoHighlightEvent = new EventEmitter<any>();
  @Output() autoDeleteEvent = new EventEmitter<any>();

  selectedColorChange = new EventEmitter<any>();
  guide_speed = 63;

  constructor(
    private popoverController: PopoverController,
  ) { }

  ngOnInit() {
    this.setupEvents();
  }

  /**
   * Subscribe to all children events
   */
  setupEvents() {
    this.selectedColorChange.subscribe(meta => {
      if (meta) {
        this.readerMeta = meta;
        this.colorSelectEvent.emit(this.readerMeta)
      }
    });
  }

  /**
   *  Change font size
   * Emit 1 for increase, 0 for decrease.
   * @param value
   */
  changeFontSize(value: number) {
    this.fontChangeEvent.emit(value);
  }

  toggleAutoHighlight() {
    this.autoHighlight = !this.autoHighlight;
    this.autoDelete = this.autoHighlight ? false : this.autoDelete;

    this.autoHighlightEvent.emit(this.autoHighlight)
    this.autoDeleteEvent.emit(this.autoDelete)
  }

  toggleAutoDelete() {
    this.autoDelete = !this.autoDelete;
    this.autoHighlight = this.autoDelete ? false : this.autoHighlight;

    this.autoHighlightEvent.emit(this.autoHighlight)
    this.autoDeleteEvent.emit(this.autoDelete)
  }

  async setHighlightColor(ev: Event) {
    const popover = await this.popoverController.create({
      component: ColorSelectPage,
      event: ev,
      mode: 'ios',
      cssClass: 'color-popover',
      componentProps: {
        readerMeta: this.readerMeta,
        eventEmitter: this.selectedColorChange,
      }
    });

    await popover.present();
  }
}
