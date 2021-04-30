import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";

declare var party: any;

@Component({
  selector: 'app-finished-reading',
  templateUrl: './finished-reading.component.html',
  styleUrls: ['./finished-reading.component.scss'],
})
export class FinishedReadingComponent implements OnInit {

  constructor(
      private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    party.screen();
  }

  continueReading(){
    this.modalCtrl.dismiss({finished: false}).then();
  }

  finishReading() {
    this.modalCtrl.dismiss({finished: true}).then();
  }
}
