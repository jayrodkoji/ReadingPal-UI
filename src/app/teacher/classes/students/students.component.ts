import {Component, Input, OnInit} from '@angular/core';
import {UsersService} from "../../../Providers/user-controller/users.service";
import { StudentService } from "../../../Providers/student-controller/student.service";

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent implements OnInit {
  @Input() classes;
  editInd: number;
  editClass: string;

  isLoading: boolean = true;

  constructor(
      private userService: UsersService,
      private studentService: StudentService
  ) { }

  ngOnInit() {
    this.editInd = -1;
    this.editClass = '';

    if(this.classes)
      this.addStudentNames();
  }

  /**
   * Add student first and last name to student object
   */
  addStudentNames() {
    this.classes.forEach((cl) => {
      cl.students.forEach((student) => {
        this.userService.getUser(student.username)
            .subscribe((res => {
              if(res){
                student.firstName = res.firstName;
                student.lastName = res.lastName;
                student.email = res.email;
                student.password = null;
                student.user = res;
              }

              this.isLoading = false;
            }))
      })
    })
  }

  /**
   * Send changes to student and user
   */
  submitChanges(student) {
    this.submitStudentChanges(student);
    this.submitUserChanges(student);
    this.submitUserPasswordChange(student);
  }

  /**
   * Send updates to student
   * @param student
   * @private
   */
  private submitStudentChanges(student) {
    this.studentService.updateStudent(
        {id: student.id,
          username: student.username,
          reading_level: student.reading_level,
          grade: student.grade
        }).subscribe(() => {
          alert("Updated info for " + student.username)
    });
  }

  /**
   * Update user object
   * @param student
   * @private
   */
  private submitUserChanges(student) {
    student.user.username = student.username;
    this.userService.updateUser(student.user).subscribe(() => {
    })
  }

  /**
   * Update users password
   * @param student
   * @private
   */
  private submitUserPasswordChange(student) {
    if(student.password) {
      this.userService.updatePassword(student.username, student.password).subscribe((res) => {
        if (res && res.message === "User updated") {

          // forget password after 5 seconds
          setTimeout(() => {
            student.password = '';
          }, 5000);
        }
      })
    }
  }
}
