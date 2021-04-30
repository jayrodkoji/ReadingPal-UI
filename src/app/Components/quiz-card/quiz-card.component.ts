import { Component, Input, OnInit } from '@angular/core';
import {QuizQuestion} from '../../Providers/quiz-controller/quiz-data';

@Component({
  selector: 'app-quiz-card',
  templateUrl: './quiz-card.component.html',
  styleUrls: ['./quiz-card.component.scss'],
})
export class QuizCardComponent implements OnInit {
  @Input() quiz: QuizQuestion[];

  constructor() { }

  ngOnInit() {}

}
