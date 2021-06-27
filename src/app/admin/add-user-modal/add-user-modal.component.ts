import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UsersService } from 'src/app/Providers/user-controller/users.service';
import { NewUser, UpdateUser } from 'src/app/Providers/user-controller/model/users-model'
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.scss'],
})
export class AddUserModalComponent implements OnInit {
  @Input() user: User
  @Input() isNewUser: Boolean

  constructor(
    private modalController: ModalController,
    private userService: UsersService
  ) { }

  ngOnInit() {
    if (!this.user)
      this.user = new User()
  }

  saveUser(user) {
    // Add the user to the database
    if (this.isNewUser === true) {
      const new_user = new NewUser(user)
      this.userService.addUser(new_user).subscribe((res: any) => {
        if (res?.success) {
          console.log('Create User Success')
          this.dismiss({ user: this.user })
        } else {
          console.log("Create User Failure")
        }
      })
    }
    // Update the user in the database
    else {
      let updateUser = new UpdateUser(user)
      this.userService.updateUser(user._id, updateUser).subscribe(res => {
        if (res?.success) {
          console.log('Update User Success')
          this.dismiss({ user: this.user })
        } else {
          console.log("Update User Failure")
        }
      })
    }
  }

  cancelUserEdit() {
    this.dismiss({})
  }

  dismiss(data) {
    this.modalController.dismiss(data)
  }
}
