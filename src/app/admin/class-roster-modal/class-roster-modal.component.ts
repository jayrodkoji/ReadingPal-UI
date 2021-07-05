import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ClassControllerService } from 'src/app/Providers/class-controller/class-controller.service';
import { AddToRosterModalComponent } from '../add-to-roster-modal/add-to-roster-modal.component';
import {UsersService} from '../../Providers/user-controller/users.service';

@Component({
  selector: 'app-class-roster-modal',
  templateUrl: './class-roster-modal.component.html',
  styleUrls: ['./class-roster-modal.component.scss'],
})
export class ClassRosterModalComponent implements OnInit {

  @Input() classroom;
  @Input() allStudentsInClass;
  @Input() allUsers;

  selectedUser: string;
  potentialStudents;

  constructor(
      private modalController: ModalController,
      private classController: ClassControllerService,
  ) { }

  dismiss() {
    this.modalController.dismiss(this.allStudentsInClass);
  }

  async onRosterAdd() {
    const modal = await this.modalController.create({
      component: AddToRosterModalComponent,
      componentProps: {
        classroom: this.classroom,
        allStudentsInClass: this.allStudentsInClass,
        potentialStudents: this.potentialStudents
      }
    });
    await modal.present();
    await modal.onDidDismiss().then(data => {
      if (data.data) {
        this.allStudentsInClass = data.data;
      }
    });
  }

  removeFromClass(student: any) {
    let new_students: any[] = [];
    this.allStudentsInClass.forEach(student => {
      new_students.push(student.username);
    });

    new_students = new_students.filter(item => item != student);

    const updatedClassData = {
      grade: this.classroom.classData.grade,
      id: this.classroom.classData.id,
      name: this.classroom.classData.name,
      studentsUserNames: new_students,
      teacherUserName: this.classroom.classData.teacher.username
    };
    this.classController.updateClass(updatedClassData).subscribe((result) => {
      if (result){
        this.allStudentsInClass = this.allStudentsInClass.filter(item => item.username != student);
      }
    });
  }

  getPotentialStudents() {
    this.potentialStudents = this.allUsers.filter(item1 => !this.allStudentsInClass.some(item2 => (item2.username === item1.username)) && item1.roles[0].type !== 'ROLE_TEACHER')
        .sort(function(a, b) {
          return ('' + a.username).localeCompare(b.username);
        });
  }


  ngOnInit() {
    console.log(this.classroom);
    console.log(this.allStudentsInClass);
    this.getPotentialStudents();
  }

}
