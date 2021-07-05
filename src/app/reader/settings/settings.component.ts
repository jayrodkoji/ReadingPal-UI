import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuController } from '@ionic/angular';


const BOLD = 'bold';
const NORMAL = 'normal';
const ITALIC = 'italic';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  @Input() fontSize;
  @Input() fontWeight;
  @Input() fontStyle;
  @Input() fontFamily;
  @Output() fontSizeChangeEvent = new EventEmitter<any>();
  @Output() fontWeightChangeEvent = new EventEmitter<any>();
  @Output() fontStyleChangeEvent = new EventEmitter<any>();
  @Output() fontFamilyChangeEvent = new EventEmitter<any>();
  @Output() themeChangeEvent = new EventEmitter<any>();

  fonts = ['Arial', 'Brush Script MT', 'Courier New', 'Garamond', 'Georgia', 'Helvetica', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana'];
  selectedFont = 0;
  dark = false;

  scrollbar = '::-webkit-scrollbar {width: 5px;}::-webkit-scrollbar-track {background: #fff;}::-webkit-scrollbar-track:hover {background: #f7f7f7;}::-webkit-scrollbar-thumb {background: #ccc;}::-webkit-scrollbar-thumb:hover { background: #888}.inner-scroll {scrollbar-width: thin}';
  bold = false;
  italic = false;

  constructor(
      private menu: MenuController,
  ) {
  }

  ngOnInit() {
    if (this.fontFamily) {
      this.fonts.forEach((font, index) => {
        if (font === this.fontFamily) {
          this.selectedFont = index;
        }
      });
    }
  }

  /**
   * Emits given font size
   * @param size: new font size
   */
  setFontSize(size: number) {
    this.fontSizeChangeEvent.emit(size);
  }

  /**
   * Changes font weight and emits change
   */
  toggleFontWeight(){
    if (this.fontWeight === BOLD) {
      this.fontWeight = NORMAL;
    }
    else {
      this.fontWeight = BOLD;
    }

    this.fontWeightChangeEvent.emit(this.fontWeight);
  }

  /**
   * Changes font style and emits change
   */
  toggleFontStyle(){
    if (this.fontStyle === ITALIC) {
      this.fontStyle = NORMAL;
    }
    else {
      this.fontStyle = ITALIC;
    }

    this.fontStyleChangeEvent.emit(this.fontStyle);
  }

  /**
   * Change font selected and emits change
   */
  setFontFamily(ind: number) {
    this.selectedFont = ind;

    this.fontFamilyChangeEvent.emit(this.fonts[this.selectedFont]);
  }

  /**
   * Close menu without saving
   */
  closeMenu(){
    this.menu.close('settings').then(r => {});
  }

  changeTheme(theme) {
    console.log(theme);

    if (theme === 'dark') {
      document.body.setAttribute('color-theme', 'dark');
    } else if (theme === 'light') {
      document.body.setAttribute('color-theme', 'light');
    }

    this.themeChangeEvent.emit(theme);
  }
}
