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
    private usersService: UsersService
  ) { }

  ngOnInit() {
    if (!this.user)
      this.user = new User()
  }

  saveUser(user) {
    // Add the user to the database
    if (this.isNewUser === true) {
      const new_user = new NewUser(user)
      this.usersService.addUser(new_user).subscribe((res: any) => {
        if (res?.success) {
          console.log('Create User Success')
          this.dismiss()
        } else {
          console.log("Create User Failure")
        }
      })
    }
    // Update the user in the database
    else {
      let updateUser = new UpdateUser(user)
      this.usersService.updateUser(user._id, updateUser).subscribe(res => {
        if (res?.success) {
          console.log('Update User Success')
          this.dismiss()
        } else {
          console.log("Update User Failure")
        }
      })
    }
  }

  deleteUser(user) {
    const confirmation = confirm(`Are you sure you want to remove ${user.username}?`);

    if (confirmation) {
      this.usersService.deleteUser(user._id).subscribe(res => {
        if(res?.success){
          console.log("Delete user success")
          this.dismiss()
        } else {
          console.log("Delete user failure")
        }
      })
    }
  }

  cancelUserEdit() {
    this.dismiss()
  }

  dismiss() {
    this.modalController.dismiss()
  }
}
