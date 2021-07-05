import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ModalController } from '@ionic/angular';
import { LoginComponent } from '../login/login/login.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private loginModalController: ModalController,
    public auth: AuthService
  ) { }

  async presentLoginModal() {
    const modal = await this.loginModalController.create({
      component: LoginComponent,
      cssClass: 'login-modal'
    });
    return await modal.present();
  }
}
