import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ClassControllerService } from 'src/app/Providers/class-controller/class-controller.service';
import { StudentService } from 'src/app/Providers/student-controller/student.service';
import {UsersService} from '../../Providers/user-controller/users.service';

@Component({
  selector: 'app-add-to-roster-modal',
  templateUrl: './add-to-roster-modal.component.html',
  styleUrls: ['./add-to-roster-modal.component.scss'],
})
export class AddToRosterModalComponent implements OnInit, OnChanges {

  constructor(
      private modalController: ModalController,
      private classController: ClassControllerService,
  ) { }

  @Input() classroom;
  @Input() allStudentsInClass;
  @Input() potentialStudents;

  studentsToAdd: any[] = [];
  classId;

  addToRoster() {
    console.log('studentsToAdd', this.studentsToAdd);
    this.studentsToAdd.forEach((user) => {
      this.classController.addStudentToClass({studentUsername: user.username, classId: this.classId}).subscribe();
    });

    const data = [...new Set(this.allStudentsInClass.concat(this.studentsToAdd))];
    this.modalController.dismiss(data);
  }

  dismiss() {
    this.modalController.dismiss(this.allStudentsInClass);
  }

  ngOnInit() {
    this.classId = this.classroom.classData.id;
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}
