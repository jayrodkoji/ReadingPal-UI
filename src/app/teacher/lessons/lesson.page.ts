import { Component, OnInit } from '@angular/core';
import {  NavController } from '@ionic/angular';


@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.page.html',
  styleUrls: ['./lesson.page.scss']
})
export class LessonPage implements OnInit {

  constructor(private navCtrl: NavController, ) { }

  ngOnInit() {
  }

  goBack() {
    this.navCtrl.back();
  }
}
