import { Component, OnInit } from '@angular/core';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lessons',
  templateUrl: './lesson.page.html',
  styleUrls: ['./lesson.page.scss'], providers: [NgbRatingConfig]
})
export class LessonPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
