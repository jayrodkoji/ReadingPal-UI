
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { ClassControllerService } from '../Providers/class-controller/class-controller.service';
import { ClassData } from '../Providers/class-controller/class-data'
import { User } from '../Providers/user-controller/model/users-model';
import { UsersService } from '../Providers/user-controller/users.service';
import { ImageUtils } from '../utils/image-utils';
import { AddClassModalComponent } from './add-class-modal/add-class-modal/add-class-modal.component';
import { AddUserModalComponent } from './add-user-modal/add-user-modal.component';
import { ClassRosterModalComponent } from './class-roster-modal/class-roster-modal.component';
import { gql } from 'apollo-angular';


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
  user: User

  showAddSchoolModel = false;
  showAddUserModel = false;
  showAddClassModel = false;
  showAddRosterModel = false;
  showAddStudentModel = false;


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
  constructor(
    private sanitizer: DomSanitizer,
    private usersService: UsersService,
    private classController: ClassControllerService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.getAllUsers();
  }

  clearUser() {
    this.user = {
      username: '',
      firstName: '',
      lastName: '',
      password: '',
      email: ''
    };
    this.userImageFileName = 'Choose a file';
    this.backgroundimageFileName = 'Choose a file';
    this.newUser = true;
  }

  // async onClassCreate() {
  //   const modal = await this.modalController.create({
  //     component: AddClassModalComponent,
  //     cssClass: 'add-class-modal',
  //     componentProps: {
  //       allUsers: this.allUsers,
  //       inputClass: this.classroom
  //     }
  //   });
  //   await modal.present();
  // }

  // async onRosterCreate() {
  //   const modal = await this.modalController.create({
  //     component: ClassRosterModalComponent,
  //     componentProps: {
  //       classroom: this.classroom,
  //       allStudentsInClass: this.allStudentsInClass,
  //       allUsers: this.allUsers
  //     }
  //   });
  //   await modal.present();
  //   await modal.onDidDismiss().then(data => {
  //     this.classroom.students = data.data;
  //   })
  // }

  // deleteClass(classroom, index) {
  //   const confirmation = confirm('Are You Sure?');
  //   if (confirmation) {
  //     this.classController.deleteClass({ 'id': classroom.classData.id }).subscribe((result) => {
  //       const removeIndex = this.allClasses.map((item) => item.classData.id).indexOf(classroom.classData.id);
  //       if (removeIndex !== -1) {
  //         this.allClasses.splice(removeIndex, 1);
  //       } else {
  //         // this.getAllSchools();
  //       }
  //     });
  //   }
  // }

  // getAllClasses() {
  //   this.allClasses = [];
  //   this.classController.getAllClasses()
  //     .subscribe(res => {
  //       if (res !== null && this.allUsers) {
  //         var anyResult = res as any;
  //         anyResult.forEach(inputClass => {
  //           var studentData: User[] = [];
  //           inputClass.students.forEach(inputStudent => {
  //             var inputStudentData = this.allUsers.find(x => x.username === inputStudent.username);

  //             studentData.push(inputStudentData);
  //           });



  //           var newClass: any = {
  //             classData: inputClass,
  //             students: studentData
  //           };
  //           if (newClass.classData.teacher.profileimage !== null) {
  //             newClass.classData.teacher.profileimage = ImageUtils.decodeDBImage(this.sanitizer, ImageUtils.convertDBImage(newClass.classData.teacher.profileimage));
  //           }
  //           this.allClasses.push(newClass)
  //         });

  //       }
  //     });
  // }

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

  // setClass(thisClassroom) {
  //   this.classroom = thisClassroom;
  // }

  // setRoster(thisClass) {
  //   this.classroom = thisClass;
  //   this.allStudentsInClass = this.classroom.students;
  //   this.onRosterCreate();
  // }

  setAddStudent(thisClass) {
    this.showAddStudentModel = true;
  }

  setUser(thisUser: User) {
    this.user = thisUser;
    this.newUser = false;
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

  deleteUser(user) {
    const confirmation = confirm(`Are you sure you want to remove ${user.username}?`);

    if (confirmation) {
      this.usersService.deleteUser(user._id)
    }
  }

  getAllUsers(): any {
    this.allUsers = [];

    const GET_USERS = gql`
      query GetUsers {
        users {
          _id
          firstName
          lastName
          username
          email
          avatar
        }
      }
    `;

    this.usersService.getUsers(GET_USERS)
      .subscribe(result => {
        if (result) {
          this.allUsers = result;
        }
      })
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

  // handleFileSelectUserImage(evt) {
  //   const files = evt.target.files;
  //   const file = files[0];
  //   if (files && file) {
  //     const reader = new FileReader();
  //     reader.onload = this.handleReaderLoadedUserImage.bind(this);
  //     reader.readAsBinaryString(file);
  //     this.userImageFileName = file.name;
  //   }
  // }

  // handleReaderLoadedUserImage(readerEvt) {
  //   const binaryString = readerEvt.target.result;
  //   this.user.profileimage = btoa(binaryString);
  // }

  // handleFileSelectBackgroundimage(evt) {
  //   const files = evt.target.files;
  //   const file = files[0];
  //   if (files && file) {
  //     const reader = new FileReader();
  //     reader.onload = this.handleReaderLoadedBackgroundimage.bind(this);
  //     reader.readAsBinaryString(file);
  //     this.backgroundimageFileName = file.name;
  //   }
  // }

  // handleReaderLoadedBackgroundimage(readerEvt) {
  //   const binaryString = readerEvt.target.result;
  //   this.user.backgroundimage = btoa(binaryString);
  // }
}
