import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import { PopoverController } from '@ionic/angular';
import {ReaderMetaService} from '../../../Providers/reader-meta/reader-meta.service';
import {HighlightData} from '../../../Providers/reader-meta/model/highlightData';

const ALPHA = 'aa';
const HIGHLIGHTYELLOW = '#ffff00' + ALPHA;

@Component({
  selector: 'app-color-select',
  templateUrl: './color-select.page.html',
  styleUrls: ['./color-select.page.scss'],
})
export class ColorSelectPage implements OnInit {
  @Input('readerMeta') readerMeta;
  @Input() eventEmitter: EventEmitter<any>;

  selectedColor;

  newColor;
  empty = [];
  openPicker = false;
  deleteColors = false;
  colorHover = -1;
  defaultColors = new Array(16).fill({id: null,
    username: '',
    color: null,
    grid_index: 0,
    page: 0
  });

  colorsOptionsLoaded: boolean;
  currentAddId: -1;

  constructor(
      private popoverController: PopoverController,
      private readerMetaService: ReaderMetaService
  ) {
  }

  ngOnInit() {
    this.setHighlightColors();

    if (this.readerMeta && this.readerMeta.last_highlight_color) {
      this.selectedColor = this.readerMeta.last_highlight_color;
    }
    else {
      this.selectedColor = HIGHLIGHTYELLOW;
    }
  }

  /**
   * Gets all highlight colors from DB
   */
  setHighlightColors(){
    this.readerMetaService.getHighlights(this.readerMeta.username).subscribe((res: HighlightData[]) => {
      if (res) {
        this.updateColors(res);
      }
    });
  }

  /**
   * Sets all colors in palette
   * @param colors
   */
  updateColors(colors) {
    for (const color of colors){
      this.defaultColors[color.grid_index] = color;
    }
  }

  /**
   * Updates selected color in DB
   * Emits event on color change
   * @param color new selected color
   */
  changeComplete(color) {
    this.selectedColor = color.color;

    this.readerMeta.last_highlight_color = this.selectedColor;

    this.readerMetaService.updateReaderMeta(this.readerMeta).subscribe((res) => {
      if (res) {
        this.eventEmitter.emit(res);
      }
    });
  }

  /**
   * Controls popover to not open more than once
   * when clicked.
   * @param ind
   */
  setOpenPicker(ind) {
    this.openPicker = !this.openPicker;
    this.currentAddId = ind;
  }

  /**
   * Get updated color on picker event
   * @param ev event
   */
  changeNewColorComplete(ev) {
    this.newColor = ev.color;
  }

  /**
   * Add color to default colors
   */
  addNewColor() {
    // default color is highlighter yellow
    if (!this.newColor) {
      this.newColor = HIGHLIGHTYELLOW + ALPHA;
    }

    // add default alpha value
    let hex = this.newColor.hex.substr(0, 7);
    hex = hex + ALPHA;

    // make sure color isn't already present
    this.defaultColors.forEach((color) => {
      if (color.color === hex) {
        this.currentAddId = -1;
      }
    });

    // add color to DB
    if (this.currentAddId !== -1) {
      this.readerMetaService.addHighlight(this.readerMeta.username, hex, this.currentAddId).subscribe((res: HighlightData[]) => {
        if (res) {
          this.updateColors(res);
        }
      });
    } else {
      alert('color already in palette');
    }

    this.openPicker = false;
    this.currentAddId = -1;
  }

  /**
   * Remove color from grid and update DB
   * @param ind: grid index
   * @param color: hex number to delete
   */
  deleteColor(ind: number, color: HighlightData){
    this.readerMetaService.deleteHighlight(color.id, this.readerMeta.username).subscribe((res) => {
      if (res) {
        this.defaultColors[ind] = '';
        this.selectedColor = HIGHLIGHTYELLOW;

        // if deleted color is selected, set selected to first in grid
        let firstInd = -1;
        let firstColor = '';
        this.defaultColors.forEach((color) => {
          if (color.color) {
            if (firstInd == -1 || color.grid_index < firstInd) {
              firstInd = color.grid_index;
              firstColor = color.color;
            }
          }
        });

        if (firstInd != -1) {
          this.selectedColor = firstColor;
        }

        // update meta
        this.readerMeta.last_highlight_color = this.selectedColor;
        this.readerMetaService.updateReaderMeta(this.readerMeta).subscribe((res) => {
          if (res) {
            this.readerMeta = res;
            this.eventEmitter.emit(this.readerMeta);
          }
        });
      }
    });
  }
}
