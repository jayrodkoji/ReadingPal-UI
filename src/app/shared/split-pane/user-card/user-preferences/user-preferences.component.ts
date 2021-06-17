import { Component, Input, OnInit } from '@angular/core';
import { ImageUtils } from 'src/app/utils/image-utils';
import { User } from 'src/app/_models/user';

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

  constructor() { }

  ngOnInit() {}

  handleAvatarFileSelect(event) {
    const files = event.target.files;
    const file = files[0];

    if (files && file) {
      ImageUtils.readImageFileData(file,
          str => {
            this.uploadedBadgeIcon = str;
          });

      ImageUtils.readImageFileURL(file,
          imgUrl => {
            this.uploadedBadgeIconUrl = imgUrl;
          });
    }
  }

  saveSettings() {
    alert("Settings saved.")
  }

}
