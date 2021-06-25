import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UsersService } from 'src/app/Providers/user-controller/users.service';
import { User } from 'src/app/Providers/user-controller/model/users-model'
import { ImageUtils } from 'src/app/utils/image-utils';
import { ImageService } from 'src/app/Providers/image-controller/image.service';

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
    email: '',
    firstName: '',
    lastName: '',
    username: '',
    password: '',
  };

  userAvatar: File;
  userBanner = '';

  role = {
    type: '',
    id: ''
  }


  isError = false;
  customErrorMessage = '';

  constructor(
    private modalController: ModalController, 
    private userService: UsersService,
    private imageService: ImageService) { }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }


  saveUser(user, role) {
    //TODO: implement image upload
    // if(this.userAvatar){
    //   this.uploadAvatar();
    // }

    // if(this.userBanner){
    //   this.uploadBanner();
    // }

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

      // Add the user to the database
      const new_user = new User(user)
      if (this.inputFlag === true) {
        this.userService.addUser(new_user).subscribe((result: any) => {

        });
      }
      // Update the user in the database
      else {
        console.log("new user", new_user)
        this.userService.updateUser(new_user).subscribe((result: any) => {

        });
      }
      
      this.dismiss()
    }
  }

  avatarSelected(ev){
    if(ev.target.value){
      this.userAvatar = <File>ev.target.files[0];
    }
  }
  
  uploadAvatar() {
    let fd = new FormData();
    
    fd.append('avatar', this.userAvatar, this.userAvatar.name);
    this.imageService.uploadAvatar(fd);
  }

  uploadBanner() {
    throw new Error('Method not implemented.');
  }

  // handleIconFileSelectProfile(event) {
  //   const files = event.target.files;
  //   const file = files[0];

  //   console.log(file);

  //   if (files && file) {
  //     ImageUtils.readImageFileData(file,
  //       str => {
  //         this.userAvatar = ImageUtils.convertToDBImage(str);
  //       });
  //   }
  // }

  handleIconFileSelectBackground(event) {
    const files = event.target.files;
    const file = files[0];

    console.log(file);

    if (files && file) {
      ImageUtils.readImageFileData(file,
        str => {
          this.userBanner = ImageUtils.convertToDBImage(str);
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
