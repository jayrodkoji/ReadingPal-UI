import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss'],
})
export class DictionaryComponent implements OnInit {
  @Input() definitions;
  currDef: number;
  defLen: number;

  exampleOpts = {
    isBeginningSlide: true,
    slidesPerView: 1,
  };

  constructor() { }

  ngOnInit() {
    this.currDef = 0;

    if (this.definitions !== '{}') {
      this.definitions = JSON.parse(this.definitions);

      if (this.definitions && this.definitions[0] && this.definitions[0].shortdef) {
        this.defLen = this.definitions[0].shortdef.length;
      }
    }
  }

  prevDef() {
    if (this.definitions && this.definitions[0].shortdef && this.currDef == 0) {
      this.currDef = this.definitions[0].shortdef.length - 1;
    }
    else {
      this.currDef--;
    }
  }

  nextDef() {
    if (this.definitions && this.definitions.length && this.currDef == this.definitions[0].shortdef.length - 1) {
      this.currDef = 0;
    }
    else {
      this.currDef++;
    }
  }

  checkIfDefinition() {
    return this.definitions[0] && (typeof this.definitions[0] !== 'string') && this.definitions[0].hwi;
  }
}
