import { Component, Input, OnInit} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuizQuestionPost } from '../../../../../Providers/quiz-controller/quiz-data';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  @Input() lessonId: number;
  @Input() sequence: number;

  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController) { }

  ngOnInit() {
    this.form = this.fb.group({
      questionText: ['', [Validators.required, Validators.minLength(1)]],
      choices: this.fb.array([
        this.initChoice(),
        this.initChoice()
      ])
    });
  }

  addChoice() {
    // this.choices.push(new ChoiceUIData('', false));
    // console.log(this.choices);

    const control = this.form.controls.choices as FormArray;
    control.push(this.initChoice());
  }

  removeChoice(i: number) {
    // this.choices.splice(i, 1);

    const control = this.form.controls.choices as FormArray;
    control.removeAt(i);
  }

  initChoice() {
    return this.fb.group({
      text: ['', Validators.required],
      correct: [false]
    });
  }

  save(model) {
    /*this.quizController.addQuestionRequest(
      new QuizQuestionPost(
        this.lessonId,
        this.sequence,
        books-service-models.value.questionText,
        books-service-models.value.choices.map(o => ({answer: o.text, true: o.correct}))
      )
    ).subscribe(
      result => {
        if (result !== null) {
          this.modalController.dismiss(
            result as QuizQuestion
          );
        }
      }
    );*/

    this.modalController.dismiss(
      new QuizQuestionPost(
        this.lessonId,
        this.sequence,
        model.value.questionText,
        model.value.choices.map(o => ({answer: o.text, correct: o.correct}))
    ));
  }
}
