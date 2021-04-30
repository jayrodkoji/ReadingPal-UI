import {AfterViewInit, Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-quiz-question',
  templateUrl: './quiz-question.component.html',
  styleUrls: ['./quiz-question.component.scss', '../quiz.page.scss'],
})
export class QuizQuestionComponent implements OnInit, AfterViewInit {
  @Input() questionText: string;
  @Input() questionNumber: number;

  @Input() answers: string[];

  @Input() review: boolean;
  @Input() answeredCorrectly: boolean;

  selectedAnswer = -1;

  @Input() set initialSelectedAnswer(value: number) {
    this.selectedAnswer = value;
  }

  constructor() { }

  ngOnInit() {
    if (this.initialSelectedAnswer !== undefined) {
      this.selectedAnswer = this.initialSelectedAnswer;
    }
  }

  ngAfterViewInit() {

  }

  buttonClass(i: number): string {
    // Review screen
    if (this.answeredCorrectly !== undefined) {
      if (this.selectedAnswer === i) {
        return this.answeredCorrectly ? 'correct' : 'incorrect';
      }
    }

    // During quiz
    else {
      if (this.selectedAnswer === i) {
        return 'selected';
      }
    }

    return 'default';
  }

  isDisabled(i: number): boolean {
    return (this.review !== undefined && this.review === true) ||
      this.answeredCorrectly !== undefined;
  }

  textFontSize(): string {
    if (!this.review && this.answeredCorrectly === undefined) {
      return '4vw';
    }
    else {
      return '2vw';
    }
  }

  graded(): boolean {
    return this.answeredCorrectly !== undefined;
  }

  correctnessTextClass(): string {
    return this.answeredCorrectly ? 'text-correct' : 'text-incorrect';
  }

  correctnessText(): string {
    return this.answeredCorrectly ? 'Correct' : 'Incorrect';
  }
}
