import { Component, Input, OnInit } from '@angular/core';
import { QuizQuestion } from 'src/app/Providers/quiz-controller/quiz-data';

@Component({
  selector: 'student-quiz-card',
  templateUrl: './student-quiz-card.page.html',
  styleUrls: ['./student-quiz-card.page.scss'],
})
export class StudentQuizCardPage implements OnInit {
  @Input() quiz: QuizQuestion[];
  
  constructor() { }

  ngOnInit() {
  }

}
