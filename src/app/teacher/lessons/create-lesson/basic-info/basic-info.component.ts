import { Component, Input, OnInit} from '@angular/core';
import {LessonData} from '../../../../Providers/lesson-services/lesson-services-models/lesson-data';
import {ModalController} from '@ionic/angular';
import {StudentAssignerComponent} from './student-assigner/student-assigner.component';
import {IDatePickerConfig} from 'ng2-date-picker';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss'],
})
export class BasicInfoComponent implements OnInit {
  public basicInfo = new LessonDataBasicInfo();

  datePickerConfig: IDatePickerConfig = {
    format: 'MMM DD, YYYY HH:mm',
    appendTo: document.body as HTMLElement
  };

  constructor(
    private modalController: ModalController,
    private datePipe: DatePipe,
    ) {}

  ngOnInit() {
  }

  @Input()
  set lesson(lesson: LessonData) {
    if (lesson) {
      this.basicInfo.lessonName = lesson.title;
      this.basicInfo.level = lesson.level;
      // TODO: Implement once we have GET API for lesson assignment from lesson ID
      //this.basicInfo.assignedDate = state.lesson.title;
      //this.basicInfo.dueDate = state.lesson.title;
    }
  }

  // TODO: Fix up
  isComplete() {
    return this.basicInfo.lessonName !== undefined;// && this.basicInfo.level !== undefined;
  }

  /*updateAssignedDate(event) {
    console.log(event);
  }*/

  async presentStudentPicker() {
    const modal = await this.modalController.create({
      component: StudentAssignerComponent,
      cssClass: 'assignment-component'
    });
    modal.onDidDismiss()
      .then(data => {
        console.log(data)
        this.basicInfo.studentIds = data.data;
      });
    await modal.present();
  }

  assignedDateChanged(event) {
    this.basicInfo.assignedDate = event.toISOString();
  }

  async dueDateChanged(event) {
    this.basicInfo.dueDate = event.toISOString();
  }

  assignedDatePlaceholder() {
    const date = new Date();
    date.setHours(0, 0);
    return this.datePipe.transform(date, 'MMM dd, yyyy hh:mm');
  }

  dueDatePlaceholder() {
    const date = new Date();
    date.setHours(23, 59);
    return this.datePipe.transform(date, '"MMM dd, yyyy" hh:mm');
  }
}

export class LessonDataBasicInfo
{
  public lessonName: string;
  public level = "1";
  public assignedDate: string;
  public dueDate: string;
  public studentIds: number[];
}
