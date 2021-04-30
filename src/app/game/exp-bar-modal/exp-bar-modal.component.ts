import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-exp-bar-modal',
  templateUrl: './exp-bar-modal.component.html',
  styleUrls: ['./exp-bar-modal.component.scss'],
})
export class ExpBarModalComponent implements OnInit {
  @Input() initialValue: number;
  @Input() expEarned = 0;
  @Input() stage = 0;
  @Input() isAnimated = true;
  @Input() isModal = true;

  constructor() { }

  ngOnInit() {}

  onClick() {
    if (this.isAnimated) {
      this.stage = Math.min(2, this.stage + 1);
    }
  }
}
