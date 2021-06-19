import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageUtils } from 'src/app/utils/image-utils';
import { User } from 'src/app/_models/user';

const AVATAR_MAX_BYTES = 200000;

@Component({
  selector: 'app-user-preferences',
  templateUrl: './user-preferences.component.html',
  styleUrls: ['./user-preferences.component.scss'],
})
export class UserPreferencesComponent implements OnInit {
  @Input() user: User
  tempUser: User;
  uploadedBadgeIconUrl: string;
  uploadedBadgeIcon: string;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() { }

  handleAvatarFileSelect(event) {
    const files = event.target.files
    const file = files[0]

    console.log(file)
    if (files && file) {
      if (file.size <= AVATAR_MAX_BYTES){
        ImageUtils.readImageFileData(file,
          str => {
            this.uploadedBadgeIcon = str
          });
  
        ImageUtils.readImageFileURL(file,
          imgUrl => {
            this.uploadedBadgeIconUrl = imgUrl
          });
      } else {
        alert(`File is too large (${file.size}). Must be under 200KB.`)
      }
      
    }
  }

  saveSettings() {
    alert("Settings saved.")
  }

  dismiss() {
    this.modalCtrl.dismiss()
  }

}
