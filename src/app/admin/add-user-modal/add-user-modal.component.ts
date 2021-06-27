import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UsersService } from 'src/app/Providers/user-controller/users.service';
import { NewUser, UpdateUser, User } from 'src/app/Providers/user-controller/model/users-model'
import { ImageUtils } from 'src/app/utils/image-utils';
import { ImageService } from 'src/app/Providers/image-controller/image.service';
import { gql } from 'apollo-angular';

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
    _id: '',
    email: '',
    firstName: '',
    lastName: '',
    username: '',
  };

  profilePic: File;
  userBanner = '';

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


  saveUser(user) {
    // Add the user to the database
    if (this.inputFlag === true) {
      const new_user = new NewUser(user)
      this.userService.addUser(new_user).subscribe((result: any) => {

      });
    }
    // Update the user in the database
    else {
      let updateUser = new UpdateUser(user);
      this.userService.updateUser(user._id, updateUser).subscribe((res: any) => {
        if (res?.data?.updateUser?.success) {
          console.log('Update User Success')
        } else {
          console.log("Update User Failure")
        }
      })
    }

    this.dismiss()
  }

  avatarSelected(ev) {
    if (ev.target.value) {
      this.profilePic = <File>ev.target.files[0];
    }
  }

  uploadAvatar() {
    let fd = new FormData();

    fd.append('avatar', this.profilePic, this.profilePic.name);
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

  ngOnInit() {
    if (this.inputFlag === false) {
      this.user = this.inputUser;
    }
  }

}
