import { Component, OnInit } from '@angular/core';
import { BADGES } from 'src/app/tempData/badges';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  badges = BADGES;

  constructor() { }

  ngOnInit() {}

}
