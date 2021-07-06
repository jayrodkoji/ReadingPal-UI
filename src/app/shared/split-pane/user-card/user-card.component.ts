import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserPreferencesComponent } from './user-preferences/user-preferences.component';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent implements OnInit {
  studentAvatar;
  dynamicStyle;
  badges: any[];
  subscription;
  userRole: any;
  firstName: any;

  data: any;
  constructor(
    public modalController: ModalController) { }


  ngOnInit() {
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
