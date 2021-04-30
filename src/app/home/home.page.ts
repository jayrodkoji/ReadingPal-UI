import { Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import {ModalController} from "@ionic/angular";
import {LoginComponent} from "../login/login/login.component";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private loginModalController: ModalController,
      ) {}

  tryReader() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        bookURL: "assets/books/The_Adventures_of_Tom_Sawyer_by_Mark_Twain.epub"
      }
    };
    this.router.navigate(['reader'], navigationExtras);
  }

  async presentLoginModal() {
    const modal = await this.loginModalController.create({
      component: LoginComponent,
      cssClass: 'login-modal'
    });
    return await modal.present();
  }
}
