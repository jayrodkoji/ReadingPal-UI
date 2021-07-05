import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BadgeControllerService } from '../../../Providers/badges/badge-controller.service';
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
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    private badgeController: BadgeControllerService,
    public modalController: ModalController) { }


  ngOnInit() {
    const username = localStorage.getItem('logedInUsername');
    this.http.get(
      environment.gatewayBaseUrl + '/users/getUser?username=' + username).subscribe(data => {
        this.userRole = data.roles[0].type;
        this.firstName = data.firstName;

        if (data !== null && data.profileimage !== null) {
          this.studentAvatar = 'data:image/png;base64,'
            + (this.sanitizer.bypassSecurityTrustResourceUrl(data.profileimage) as any).changingThisBreaksApplicationSecurity;
        }
        else {
          this.studentAvatar =
            '../../assets/user.png';
        }

        if (data !== null && data.backgroundimage !== null) {
          this.dynamicStyle = 'data:image/png;base64,'
            + (this.sanitizer.bypassSecurityTrustResourceUrl(data.backgroundimage) as any).changingThisBreaksApplicationSecurity;
        } else {
          this.dynamicStyle = 'url(../../../assets/default-banner.jpg)';
        }
      });

    this.badgeController.getUsersBadges(username)
      .subscribe(res => {
        this.badges = res;
      });
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
