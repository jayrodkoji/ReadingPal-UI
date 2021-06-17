
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { TimeoutError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ISchool } from '../content-dto/ISchool';
import { IUser } from '../content-dto/IUser';
import { UserRole } from '../content-dto/UserRole';
import { ClassControllerService } from '../Providers/class-controller/class-controller.service';
import { ClassData, newClassData } from '../Providers/class-controller/class-data'
import { UsersModel } from '../Providers/user-controller/model/users-model';
import { ImageUtils } from '../utils/image-utils';
import { AddClassModalComponent } from './add-class-modal/add-class-modal/add-class-modal.component';
import { AddUserModalComponent } from './add-user-modal/add-user-modal.component';
import { ClassRosterModalComponent } from './class-roster-modal/class-roster-modal.component';


export class FullClassData {
  classData: ClassData;
  students: any[];
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  private baseUrl: string = environment.gatewayBaseUrl;
  school = {
    id: 0,
    name: '',
    teacher_code: '',
    student_code: ''
  };

  roles = {
    id: 'string',
    type: 'string'
  };

  user = {
    username: '',
    firstName: '',
    lastName: '',
    roles: [],
    password: '',
    profileimage: '',
    backgroundimage: '',
    email: ''
  };

  classroom = {
    id: 0,
    grade: '',
    name: '',
    teacherUserName: '',
    students: []
  };

  roster = {

  };

  student = {
    id: 0,
    username: '',
    grade: '',
    reading_level: null,
    starting_level: null,
  };


  showAddSchoolModel = false;
  showAddUserModel = false;
  showAddClassModel = false;
  showAddRosterModel = false;
  showAddStudentModel = false;


  allSchools: ISchool[];
  allUsers: any[];
  allRoles: any[];
  allClasses: FullClassData[];
  allStudentsInClass: any[];
  allStudents: any[];
  allTeachers: any[];
  addUser = true;

  isError = false;
  customErrorMessage = '';

  dropDownData = ['Choose Role', 'Student', 'Teacher', 'Admin'];
  isStudent = false;
  editMode = false;

  userImageFileName = 'Choose a file';
  backgroundimageFileName = 'Choose a file';

  userRole = 'Choose Role';
  newUser = true;
  constructor(private router: Router, private http: HttpClient, private sanitizer: DomSanitizer, private classController: ClassControllerService, private modalController: ModalController) { }

  ngOnInit() {

    const uRole = localStorage.getItem('logedInRole');
    console.log(uRole);
    if (uRole !== 'ROLE_ADMIN') {
      this.router.navigate(['../bad-login'], { replaceUrl: true });
    }

    // this.getAllSchools();
    this.getAllUsers();
    // this.getAllClasses();
  }

  clearSchool() {
    this.school = {
      id: 0,
      name: '',
      teacher_code: '',
      student_code: ''
    };
  }

  clearUser() {
    this.user = {
      username: '',
      firstName: '',
      lastName: '',
      roles: [],
      password: '',
      profileimage: '',
      backgroundimage: '',
      email: ''
    };
    this.userImageFileName = 'Choose a file';
    this.backgroundimageFileName = 'Choose a file';
    this.newUser = true;
  }

  clearClass() {
    this.classroom = {
      id: 0,
      grade: '',
      name: '',
      teacherUserName: '',
      students: []
    };
  }


  async onClassCreate() {
    const modal = await this.modalController.create({
      component: AddClassModalComponent,
      cssClass: 'add-class-modal',
      componentProps: {
        allUsers: this.allUsers,
        inputClass: this.classroom
      }
    });
    await modal.present();
  }

  async onRosterCreate() {
    const modal = await this.modalController.create({
      component: ClassRosterModalComponent,
      componentProps: {
        classroom: this.classroom,
        allStudentsInClass: this.allStudentsInClass,
        allUsers: this.allUsers
      }
    });
    await modal.present();
    await modal.onDidDismiss().then(data => {
      this.classroom.students = data.data;
    })
  }

  deleteClass(classroom, index) {
    const confirmation = confirm('Are You Sure?');
    if (confirmation) {
      this.classController.deleteClass({ 'id': classroom.classData.id }).subscribe((result) => {
        const removeIndex = this.allClasses.map((item) => item.classData.id).indexOf(classroom.classData.id);
        if (removeIndex !== -1) {
          this.allClasses.splice(removeIndex, 1);
        } else {
          // this.getAllSchools();
        }
      });
    }
  }

  getAllClasses() {
    this.allClasses = [];
    this.classController.getAllClasses()
      .subscribe(res => {
        if (res !== null && this.allUsers) {
          var anyResult = res as any;
          anyResult.forEach(inputClass => {
            var studentData: UsersModel[] = [];
            inputClass.students.forEach(inputStudent => {
              var inputStudentData = this.allUsers.find(x => x.username === inputStudent.username);

              studentData.push(inputStudentData);
            });
            


            var newClass: any = {
              classData: inputClass,
              students: studentData
            };
            if (newClass.classData.teacher.profileimage !== null) {
              newClass.classData.teacher.profileimage = ImageUtils.decodeDBImage(this.sanitizer, ImageUtils.convertDBImage(newClass.classData.teacher.profileimage));
            }
            this.allClasses.push(newClass)
          });

        }
      });
  }

  onOptionsSelected(sel) {
    this.userRole = sel.options[sel.selectedIndex].text;
    if (sel.options[sel.selectedIndex].text === 'Student') {
      this.isStudent = true;
    } else {
      this.isStudent = false;
    }
  }

  userEdit(val) {
    if (val) {
      this.editMode = true;
      this.userRole = '';
    } else {
      this.editMode = false;
    }
  }

  // setSchool(thisSchool: ISchool) {
  //   this.school = thisSchool;
  //   this.showAddSchoolModel = true;
  // }

  setClass(thisClassroom) {
    this.classroom = thisClassroom;
  }

  setRoster(thisClass) {
    this.classroom = thisClass;
    this.allStudentsInClass = this.classroom.students;
    this.onRosterCreate();
  }

  setAddStudent(thisClass) {
    this.showAddStudentModel = true;
  }

  setUser(thisUser: IUser) {
    this.user = thisUser;
    this.newUser = false;
  }

  setStudent(thisStudent: any) {
    this.student = thisStudent;
  }

  async onUserCreate() {
    const modal = await this.modalController.create({
      component: AddUserModalComponent,
      cssClass: 'add-user-modal',
      componentProps: {
        inputUser: this.user,
        inputFlag: this.newUser,
      }
    });
    await modal.present();
  }

  deleteUser(user, index) {
    const confirmation = confirm('Are You Sure?');
    if (confirmation) {
      this.http.delete(this.baseUrl + '/users/deleteUser?userName=' + user.username, {
      }).subscribe((result) => {
      }, error => {
        console.log(error);
      });
      const removeIndex = this.allUsers.map((item) => item.username).indexOf(user.username);
      if (removeIndex !== -1) {
        this.allUsers.splice(removeIndex, 1);
      } else {
        this.getAllUsers();
      }
    }
  }

  getAllUsers(): any {
    this.allUsers = [];
    this.http.get(this.baseUrl + '/users/getUsers?username=' + localStorage.getItem('logedInUsername'))
      .subscribe((result) => {
        var anyResult = result as any;
        anyResult.forEach(element => {
          element.role = this.http.get(
            environment.gatewayBaseUrl + '/users/getUser?username=' + element.username).subscribe(response => {
              element.role = (response['roles'][0]['type']).slice(5, 13).toLowerCase();
              element.role = element.role.charAt(0).toUpperCase() + element.role.slice(1);
            });
          if (element.profileimage !== null) {
            element.profileimage = 'data:image/png;base64,'
              + (this.sanitizer.bypassSecurityTrustResourceUrl(element.profileimage) as any).changingThisBreaksApplicationSecurity;
          }
          if (element.backgroundimage !== null) {
            element.backgroundimage = 'data:image/png;base64,'
              + ((this.sanitizer.bypassSecurityTrustResourceUrl(element.backgroundimage) as any).changingThisBreaksApplicationSecurity);
          }

          this.allUsers.push(element)

        });
        this.getAllClasses()
      });
  }

  runErrorMessage(message, reload?) {
    this.isError = false;
    this.customErrorMessage = '';
    const killId = setTimeout(() => {
      for (let i = killId as any; i > 0; i--) { clearInterval(i); }
      if (this.isError === false) {
        this.isError = false;
        this.customErrorMessage = '';
        if (message) {
          this.isError = true;
          this.customErrorMessage = message;
        }
        if (reload) {
          // do reload or redirect to where the user is supposed to be.
        }
        setTimeout(() => {
          this.isError = false;
          this.customErrorMessage = '';
        }, 4000);
      }
    }, 300);
  }

  handleFileSelectUserImage(evt) {
    const files = evt.target.files;
    const file = files[0];
    if (files && file) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoadedUserImage.bind(this);
      reader.readAsBinaryString(file);
      this.userImageFileName = file.name;
    }
  }

  handleReaderLoadedUserImage(readerEvt) {
    const binaryString = readerEvt.target.result;
    this.user.profileimage = btoa(binaryString);
  }

  handleFileSelectBackgroundimage(evt) {
    const files = evt.target.files;
    const file = files[0];
    if (files && file) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoadedBackgroundimage.bind(this);
      reader.readAsBinaryString(file);
      this.backgroundimageFileName = file.name;
    }
  }

  handleReaderLoadedBackgroundimage(readerEvt) {
    const binaryString = readerEvt.target.result;
    this.user.backgroundimage = btoa(binaryString);
  }
}
