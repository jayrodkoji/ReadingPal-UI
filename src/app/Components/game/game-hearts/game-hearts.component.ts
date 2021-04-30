import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-game-hearts',
  templateUrl: './game-hearts.component.html',
  styleUrls: ['./game-hearts.component.scss'],
})
export class GameHeartsComponent implements OnInit {
  @Input() heartsMax: number;
  @Input() heartsCurrent: number;

  constructor() { }

  ngOnInit() {}

}
