import { Component, Input, OnInit, ValueSansProvider } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UsersService } from 'src/app/Providers/user-controller/users.service';
import { NewUser, UpdateUser, User } from 'src/app/Providers/user-controller/model/users-model';
import { ImageService } from 'src/app/Providers/image-controller/image.service';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.scss'],
})
export class AddUserModalComponent implements OnInit {
  @Input() user: User;
  @Input() isNewUser: boolean;
  profileImgFile: File;
  profileImageURL: string;
  currentProfileImg: string;

  constructor(
    private modalController: ModalController,
    private usersService: UsersService,
    private imageService: ImageService
  ) { }

  ngOnInit() {
    if (!this.user) {
      this.user = new User({});
    }

    this.getProfileImageURL();
  }

  /**
   * Callback for profileImg input event
   * @param ev: Upload event
   */
  profileImgSelect(ev): void {
    if (ev.target.value) {
      this.profileImgFile = (ev.target.files[0] as File);

      // Used to show image before submitting
      const reader = new FileReader();
      reader.onload = () => {
        this.currentProfileImg = reader.result as string;
      };

      reader.readAsDataURL(this.profileImgFile);
    }
  }

  /**
   * Save user data.
   * Saves data even on image upload failure
   * @param user: user to be saved
   */
  saveUser(user: User) {
    this.uploadPhoto(user)
      .subscribe((res: any) => {
        if (res.imageKey) {
          this.user.profileImageKey = res.imageKey;
          this.getProfileImageURL();
        } else {
          alert('Error adding photo');
        }

        this.saveUserData(user);
      });
  }

  /**
   * Uploads profileImg to s3
   * @param user: user data used in case of update to photo
   * @returns: profileImage key
   */
  uploadPhoto(user) {
    if (this.profileImgFile) {
      const key = user.profileImageKey ? user.profileImageKey : 'new';
      const fd = new FormData();
      fd.append('profileImg', this.profileImgFile);
      return this.imageService.updateProfileImage(fd, key);
    }
  }

  /**
   * Gets profileImg url
   */
  getProfileImageURL(): void {
    if (this.user.profileImageKey) {
      this.currentProfileImg = this.profileImageURL = this.imageService.getProfileImage(this.user.profileImageKey);
    }
  }

  /**
   * Save user data to database
   * @param user: User to be saved
   */
  saveUserData(user: User): void {
    // Add the user to the database
    if (this.isNewUser === true) {
      const newUser = new NewUser(user);
      this.usersService.addUser(newUser).subscribe((res: any) => {
        this.printResultSuccess(res, 'Add User');
      });
    }
    // Update the user in the database
    else {
      const updateUser = new UpdateUser(user);
      this.usersService.updateUser(user._id, updateUser).subscribe(res => {
        this.printResultSuccess(res, 'Update User Data');
      });
    }
  }

  /**
   * Deletes all user data and photos
   * User deleteUserData, or deleteUserImages for specific deletions
   * @param user: user to be deleted
   */
  deleteAllUserData(user) {
    const confirmation = confirm(`Are you sure you want to remove ${user.username}?`);

    if (confirmation) {
      this.usersService.deleteUserData(user._id).subscribe(res => {
        this.printResultSuccess(res, 'Delete User Data');
      });

      this.imageService.deleteUserImages(user.profileImageKey).subscribe((res: any) => {
        this.printResultSuccess(res, 'Delete ProfileImg');
      });
    }
  }

  /**
   *
   * @param res: results from service call
   * @param message: Message to be appended to 'Success: ' or 'Failure: ' string
   */
  printResultSuccess(res: any, message: string) {
    if (res?.success) {
      console.log('Success: ' + message);
      this.dismiss();
    } else {
      console.log('Failure: ' + message);
      alert('Failure to: ' + message);
    }
  }

  /**
   * Dismiss modal
   */
  dismiss() {
    this.modalController.dismiss();
  }
}
