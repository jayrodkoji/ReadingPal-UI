import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UsersService } from 'src/app/Providers/user-controller/users.service';
import { UserPreferencesComponent } from './user-preferences/user-preferences.component';
import { gql } from 'apollo-angular';
import { JWTTokenService } from 'src/app/Providers/jwt/jwttoken.service';
import { ImageService } from 'src/app/Providers/image-controller/image.service';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent implements OnInit {
  user = {
    firstName: '',
    profileImgURL: '',
    banner: '',
  }

  GET_USER = gql`
    query getUserByEmail($email: String!) {
      userByEmail(email: $email) {
        firstName
        profileImageKey
      }
    }
  `;

  data: any;
  constructor(
    public modalController: ModalController,
    private userService: UsersService,
    private jwtTokenService: JWTTokenService,
    private imageService: ImageService
  ) { }


  ngOnInit() {
    this.getUserData()
  }

  getUserData() {
    this.userService.getUserByEmail(this.jwtTokenService.getEmail(), this.GET_USER).subscribe((res: any) => {
      this.user.firstName = res.data?.userByEmail?.firstName;
      this.user.profileImgURL = this.imageService.getProfileImage(res.data?.userByEmail?.profileImageKey)
    }, error => console.log(error))
  }

  async showUserPreferences() {
    const modal = await this.modalController.create({
      component: UserPreferencesComponent,
      backdropDismiss: false,
      cssClass: 'user-settings-modal'
    });
    return await modal.present();
  }
}
