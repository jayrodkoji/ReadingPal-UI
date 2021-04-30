import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {forkJoin, Observable, Subject} from 'rxjs';
import {LessonService} from '../../Providers/lesson-services/lesson.service';
import {LessonData} from '../../Providers/lesson-services/lesson-services-models/lesson-data';
import {QuizControllerService} from '../../Providers/quiz-controller/quiz-controller.service';
import {VocabularyServicesService} from '../../Providers/vocabulary-services/vocabulary-services.service';
import {StudentService} from '../../Providers/student-controller/student.service';

@Component({
  selector: 'app-vocab1-options',
  templateUrl: './vocab1-options.component.html',
  styleUrls: ['./vocab1-options.component.scss'],
})
export class Vocab1OptionsComponent implements OnInit {
  formGroup: FormGroup;
  submitEvent: Subject<Vocab1Options>;
  lessons: LessonData[];
  mLessonId: number;

  @Input() set lessonId(value: number) {
    if (value !== undefined) {
      this.formGroup.controls.lessonId.setValue(value);
      console.log(this.formGroup.controls);
      console.log({value});
      if (typeof(value) === 'string') {
        value = parseInt(value, 10);
      }
      this.mLessonId = value;
    }
  }

  lessonCompareWith(el1, el2) {
    return el1 === el2;
  }

  constructor(
    private formBuilder: FormBuilder,
    private lessonService: LessonService,
    private vocabController: VocabularyServicesService,
    private studentController: StudentService) {
    this.formGroup = this.formBuilder.group({
      inputType: [''],
      lessonId: ['-1']
    });
    this.lessons = [];
  }

  ngOnInit() {
    this.submitEvent = new Subject<Vocab1Options>();

    this.studentController.getStudentByUsername(localStorage.getItem('logedInUsername'))
      .subscribe(student => {
        this.lessonService.getAssignLessonFiltered(student.id)
          .subscribe(assignments => {
            if (assignments !== null) {
              const assignmentObservables = assignments.map(
                assignment => {
                  return this.vocabController.getVocabDirect(assignment.lessonId.toString());
                });

              if (this.mLessonId !== undefined) {
                if (assignments.find(assignment => assignment.lessonId === this.mLessonId) === undefined) {
                  assignments.push({lessonId: this.mLessonId});
                }
              }

              forkJoin(assignmentObservables).subscribe(vocabs => {
                forkJoin(assignments.filter(
                  (lesson, i) => vocabs[i].length > 0
                ).map(
                  assignment => this.lessonService.getLessonById(assignment.lessonId.toString())
                )).subscribe(
                  res => {
                    this.lessons = res;
                  }
                );
              });
            }
          });
      });
  }

  onSubmit(): Observable<Vocab1Options> {
    return this.submitEvent.asObservable();
  }

  submit() {
    this.submitEvent.next(
      new Vocab1Options(
        this.formGroup.value.inputType,
        this.formGroup.value.lessonId
      )
    );
  }

  gameTypeButtonClass(optionName: string) {
    if (this.formGroup.value.inputType === optionName) {
      return 'selected';
    }
    else {
      return 'default';
    }
  }

  gameTypeButtonClick(optionName: string) {
    this.formGroup.controls.inputType.setValue(optionName);
  }

  isValid() {
    return this.formGroup.value.inputType !== '' && this.formGroup.value.lessonId !== -1;
  }

  placeholder() {
    if (this.mLessonId !== undefined) {
      const lesson = this.lessons.find(v => v.id === this.mLessonId);
      if (lesson) {
        return lesson.title;
      }
    }
    else {
      return 'Select One';
    }
  }
}

export class VocabPair
{
  constructor(
    public word: string,
    public definition: string) {
  }
}

export class Vocab1Options
{
  public vocabPairs: VocabPair[];

  constructor(
    public inputType: string,
    public lessonId: number
  ) {

  }

}
