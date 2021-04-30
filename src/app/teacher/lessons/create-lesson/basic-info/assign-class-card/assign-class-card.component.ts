import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {UsersService} from "../../../../../Providers/user-controller/users.service";
@Component({
  selector: 'app-assign-class-card',
  templateUrl: './assign-class-card.component.html',
  styleUrls: ['./assign-class-card.component.scss'],
})
export class AssignClassCardComponent implements OnInit {
  @Input() class;
  @Output() studentsChanged = new EventEmitter<any>();
  slideOptions: any;
  selected: boolean = false;

  studentsToAdd: any[] = [];

  constructor(
      private usersController: UsersService
  ) { }

  ngOnInit() {
    this.getUsers();

    this.slideOptions = {
      slidesPerView: 3,
      zoom: false,
      grabCursor: true
    };
  }

  getUsers() {
    for (let student of this.class.students) {
      this.usersController.getUser(student.username).subscribe(res => {
        if(res){
          student.firstName = res.firstName;
          student.lastName = res.lastName;
          student.class = this.class.id
        }
      })
    }
  }

  studentsAltered() {
    let data = {students: this.studentsToAdd, class: this.class.id}
    this.studentsChanged.emit(data);
  }

  addStudents(students: [any]) {
    if (students && students.length > 0) {
      students.forEach(student => {
        if(!this.isInList(student))
          this.studentsToAdd.push(student)
      });
    }
    else {
      this.studentsToAdd = [];
    }

    this.studentsAltered();
    console.log(this.studentsToAdd)
  }

  isInList(student: any) {
    return this.studentsToAdd.indexOf(student) != -1
  }

  addSingleStudent(event: any, student: any) {
    if (event.detail.checked && student) {
      if(!this.isInList(student))
        this.studentsToAdd.push(student)
    }
    else {
      this.studentsToAdd = this.studentsToAdd.filter(st => st.username != student.username)
    }

    this.studentsAltered();
  }
}
