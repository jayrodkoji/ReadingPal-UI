import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { ClassControllerService } from 'src/app/Providers/class-controller/class-controller.service';
import { UsersService } from 'src/app/Providers/user-controller/users.service';
import { ImageUtils } from 'src/app/utils/image-utils';
import { ClassData, newClassData } from '../../../Providers/class-controller/class-data'

@Component({
  selector: 'app-add-class-modal',
  templateUrl: './add-class-modal.component.html',
  styleUrls: ['./add-class-modal.component.scss'],
})
export class AddClassModalComponent implements OnInit {
  
  @Input() inputClass;

  classroom = {
    id: 0,
    grade: '',
    name: '',
    teacherUserName: '',
    students: []
  };

  potentialTeachers: any[];

  constructor(private classController: ClassControllerService, private userController: UsersService, private modalController: ModalController) { }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  saveClass(classroom) {
    if (classroom.id === 0) {
      const newClass = new newClassData(classroom);
      this.classController.addClass(newClass).subscribe((data: any) => {
        // data.teacher.profileimage = ImageUtils.decodeDBImage(this.sanitizer, ImageUtils.convertDBImage(data.teacher.profileimage));
        // this.allClasses.push(data);
      });
    }
    else {
      this.classController.updateClass(classroom).subscribe((data: any) => {
      });
    }
    this.dismiss();
  }

  getPotentialTeachers() {
    this.potentialTeachers = [];
    this.userController.getTeachers().subscribe((result: any) => {
      if (result !== null) {
        this.potentialTeachers = result;
      }
    });
  }

  editClass(classroom) {

    var new_students: any[] = [];
    this.inputClass.students.forEach(student => {
      new_students.push(student.username);
    });


    var updatedClassData = {
      grade: classroom.grade,
      id: classroom.id,
      name: classroom.name,
      studentsUserNames: new_students,
      teacherUserName: classroom.teacherUserName
    }
    this.classController.updateClass(updatedClassData).subscribe((result) => {

    });
    this.dismiss();
  }

  ngOnInit() {
    
    if (this.inputClass.id !== 0)
    {
      this.classroom.id = this.inputClass.classData.id;
      this.classroom.name = this.inputClass.classData.name;
      this.classroom.teacherUserName = this.inputClass.classData.teacherUserName;
      this.classroom.grade = this.inputClass.classData.grade;
    }
    this.getPotentialTeachers();
    
  }

}
