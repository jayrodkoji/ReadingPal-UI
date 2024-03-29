import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { gql } from 'apollo-angular';
import { User } from '../Providers/user-controller/model/users-model';
import { UsersService } from '../Providers/user-controller/users.service';
import { AddUserModalComponent } from './add-user-modal/add-user-modal.component';

@Component({
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  user: User;
  allUsers: User[];

  constructor(
    private usersService: UsersService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.getAllUsers();
  }

  async onUserCreate() {
    const modal = await this.modalController.create({
      component: AddUserModalComponent,
      cssClass: 'add-user-modal',
      componentProps: {
        user: null,
        isNewUser: true,
      }
    });
    await modal.present();
  }

  async onUserEdit(user: User) {
    const modal = await this.modalController.create({
      component: AddUserModalComponent,
      cssClass: 'add-user-modal',
      backdropDismiss: false,
      componentProps: {
        user,
        isNewUser: false,
      }
    });
    await modal.present();
  }

  handleUpdate() {
    console.log();
  }

  getAllUsers() {
    this.allUsers = [];

    const GET_USERS = gql`
      query GetUsers {
        users {
          _id
          firstName
          lastName
          username
          email
          profileImageKey
        }
      }
    `;

    this.usersService.getUsers(GET_USERS)
      .subscribe(result => {
        if (result) {
          this.allUsers = result;
        }
      });
  }
}
