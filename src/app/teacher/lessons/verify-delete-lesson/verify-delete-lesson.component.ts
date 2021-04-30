import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {LessonService} from '../../../Providers/lesson-services/lesson.service';

@Component({
  selector: 'app-verify-delete-lesson',
  templateUrl: './verify-delete-lesson.component.html',
  styleUrls: ['./verify-delete-lesson.component.scss'],
})
export class VerifyDeleteLessonComponent implements OnInit {
  @Input() lessonId: number;
  @Input() lessonName: string;

  constructor(
    private modalController: ModalController,
    private lessonService: LessonService) { }

  ngOnInit() {

  }

  onYes() {
    this.lessonService.deleteLesson({id: this.lessonId})
      .subscribe(() => {
        this.modalController.dismiss({deleted: true});
    });
  }

  onNo() {
    this.modalController.dismiss({deleted: false});
  }
}
