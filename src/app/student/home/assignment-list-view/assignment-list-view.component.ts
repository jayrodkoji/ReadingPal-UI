import {Component, Input, OnInit} from '@angular/core';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-assignment-list-view',
  templateUrl: './assignment-list-view.component.html',
  styleUrls: ['./assignment-list-view.component.scss'],
})
export class AssignmentListViewComponent implements OnInit {
  @Input() singularName: string;
  @Input() pluralName: string;

  lessonAssignments: any[];
  assignedLessons: any[];
  books: any[];

  constructor() { }

  ngOnInit() {}

  lessonDueDate(i: number) {
    return this.lessonAssignments[i].assignment.dueDate;
  }

  lessonDueDuration(i: number) {
    const dueDateStr = this.lessonDueDate(i);
    const dueDate = dayjs(dueDateStr, 'YYYY-MM-DD HH:MM:ss.SSS');
    const time = dayjs();

    return time.to(dueDate);
  }
}
