import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {UsersService} from "../../../../../Providers/user-controller/users.service";
import {ClassControllerService} from "../../../../../Providers/class-controller/class-controller.service";
import {StudentService} from "../../../../../Providers/student-controller/student.service";

@Component({
  selector: 'app-assign-group-card',
  templateUrl: './assign-group-card.component.html',
  styleUrls: ['./assign-group-card.component.scss'],
})
export class AssignGroupCardComponent implements OnInit {

  @Input() group;
  @Output() studentsChanged = new EventEmitter<any>();
  slideOptions: any;
  selected: boolean = false;

  studentsToAdd: any[] = [];
  private students: any;

  constructor(
      private usersController: UsersService,
      private studentController: StudentService
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
    this.studentController.getStudents().subscribe(res => {
      if(res) {
        this.students = [];

        res.forEach(st => {
          this.group.students.forEach(gst => {
            if (st.id == gst)
              this.students.push(st)
          })
        })

        for (let student of this.students) {
          // this.usersController.getUser(student.username).subscribe(result => {
          //   if(result){
          //     student.firstName = result.firstName;
          //     student.lastName = result.lastName;
          //     student.class = this.group.class_id
          //   }
          // })
        }
      }
    })
  }

  studentsAltered() {
    let data = {students: this.studentsToAdd, class: this.group.class_id}
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
