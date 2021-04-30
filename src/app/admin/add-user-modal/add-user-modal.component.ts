import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UsersService } from 'src/app/Providers/user-controller/users.service';
import { UsersModel } from 'src/app/Providers/user-controller/model/users-model'
import { ImageUtils } from 'src/app/rp-utils/image-utils';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.scss'],
})
export class AddUserModalComponent implements OnInit {

  @Input() inputUser;
  @Input() inputFlag;
  @Input() newUser;

  user = {
    backgroundimage: '',
    email: '',
    firstName: '',
    lastName: '',
    profileimage: '',
    username: '',
    password: '',
    roles: [{
      type: '',
      id: ''
    }]
  };

  role = {
    type: '',
    id: ''
  }


  isError = false;
  customErrorMessage = '';

  constructor(private modalController: ModalController, private http: HttpClient, private sanitizer: DomSanitizer, private userController: UsersService) { }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }


  saveUser(user, role) {
    console.log(user);
    user.roles[0].type = role.type;
    if (user.username === '' || user.username === undefined) {
      this.runErrorMessage('Please Enter A Username');
    } else if ((user.password === '' || user.password === undefined) && this.inputFlag != 0) {
      this.runErrorMessage('Please Enter A Password');
    } else if (user.roles[0].type === 'Choose Role') {
      // If you dont select a user role show message and dont do anything
      this.runErrorMessage('Please Select A User Role');
      // } else if (!parseInt(this.student.reading_level) && this.userRole === 'Student') {
      //   this.runErrorMessage('Please Enter A Valid Reading Level');
    } else {
      // If this user is a student
      if (user.roles[0].type === 'Student') {
        user.roles[0].id = 'b45660ac-64a7-4cb0-88a6-d366ade8b9b4';
        user.roles[0].type = 'ROLE_STUDENT';
      } else if (user.roles[0].type === 'Admin') {
        user.roles[0].id = 'f60c5c3d-f079-4ad3-98a5-04c61ae39c60';
        user.roles[0].type = 'ROLE_ADMIN';
      } else if (user.roles[0].type === 'Teacher') {
        user.roles[0].id = '8a2bb385-d1ff-434a-8453-49e6d45ea7e0';
        user.roles[0].type = 'ROLE_TEACHER';
      }

      // Add the user to the database
      const new_user = new UsersModel(user)
      if (this.inputFlag === true) {
        this.userController.addUser(new_user).subscribe((result: any) => {

        });
      }
      // Update the user in the database
      else {
        console.log("new user", new_user)
        this.userController.updateUser(new_user).subscribe((result: any) => {

        });
      }
      
      this.dismiss()
    }
  }

  handleIconFileSelectProfile(event) {
    const files = event.target.files;
    const file = files[0];

    console.log(file);

    if (files && file) {
      ImageUtils.readImageFileData(file,
        str => {
          this.user.profileimage = ImageUtils.convertToDBImage(str);
        });
    }
  }

  handleIconFileSelectBackground(event) {
    const files = event.target.files;
    const file = files[0];

    console.log(file);

    if (files && file) {
      ImageUtils.readImageFileData(file,
        str => {
          this.user.backgroundimage = ImageUtils.convertToDBImage(str);
        });
    }
  }

    runErrorMessage(message, reload ?) {
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

    ngOnInit() {
      if (this.inputFlag === false) {
        this.user.firstName = this.inputUser.firstName;
        this.user.lastName = this.inputUser.lastName;
        this.user.email = this.inputUser.email;
        this.user.username = this.inputUser.username;
      }
    }

  }
