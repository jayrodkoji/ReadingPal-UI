import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToasterService } from 'src/app/shared/toastr.service';
import { ImageUtils } from 'src/app/utils/image-utils';
import { User } from 'src/app/_models/user';

const AVATAR_MAX_BYTES = 200000;
const BANNER_MAX_BYTES = 400000;

@Component({
  selector: 'app-user-preferences',
  templateUrl: './user-preferences.component.html',
  styleUrls: ['./user-preferences.component.scss'],
})
export class UserPreferencesComponent implements OnInit {
  @Input() user: User
  tempUser: User;
  uploadedAvatarIconUrl: string;
  uploadedAvatarIcon: string;
  uploadedBannerIconUrl: string;
  uploadedBannerIcon: string;

  constructor(
    private modalCtrl: ModalController,
    private toastr: ToasterService) { }

  ngOnInit() { }

  handleAvatarFileSelect(event) {
    const files = event.target.files
    const file = files[0]

    console.log(file)
    if (files && file) {
      if (file.size <= AVATAR_MAX_BYTES){
        ImageUtils.readImageFileData(file,
          str => {
            this.uploadedAvatarIcon = str
          });
  
        ImageUtils.readImageFileURL(file,
          imgUrl => {
            this.uploadedAvatarIconUrl = imgUrl
          });
      } else {
        this.toastr.error(`Must be under ${AVATAR_MAX_BYTES/1000}KB.`, `File Too Large (${file.size/1000}KB)`)
      }
      
    }
  }

  handleBannerFileSelect(event) {
    const files = event.target.files
    const file = files[0]

    console.log(file)
    if (files && file) {
      // if (file.size <= BANNER_MAX_BYTES){
      ImageUtils.readImageFileData(file,
        str => {
          this.uploadedBannerIcon = str
        });

      ImageUtils.readImageFileURL(file,
        imgUrl => {
          this.uploadedBannerIconUrl = imgUrl
        });
      // } else {
      //   this.toastr.error(`Must be under ${BANNER_MAX_BYTES/1000}KB.`, `File Too Large (${file.size/1000}KB)`)
      // }
      
    }
  }

  saveSettings() {
    alert("Settings saved.")
  }

  dismiss() {
    this.modalCtrl.dismiss()
  }

}
