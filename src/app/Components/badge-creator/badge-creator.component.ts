import { Component, OnInit } from '@angular/core';
import {BadgeControllerService} from '../../Providers/badges/badge-controller.service';
import {BadgeData} from '../../Providers/badges/badge-data';
import {DomSanitizer} from '@angular/platform-browser';
import {ImageUtils} from '../../rp-utils/image-utils';
import { ModalController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-badge-creator',
  templateUrl: './badge-creator.component.html',
  styleUrls: ['./badge-creator.component.scss'],
})
export class BadgeCreatorComponent implements OnInit {
  public badgeIconPaths: string[];
  public badgeDataList: BadgeData[];

  badgeIndex: number;
  badgeName: string;
  badgeDescription: string;
  uploadedBadgeIcon: string;
  uploadedBadgeIconUrl: string;

  constructor(
    private badgeCreatorService: BadgeControllerService,
    private sanitizer: DomSanitizer,
    public popoverController: PopoverController,
    public modalController: ModalController
    ) {}

  ngOnInit() {
    this.badgeIndex = -1;

    // Default badges
    this.badgeIconPaths = [
      './assets/gamification_1.png',
      './assets/gamification_2.png',
      './assets/gamification_3.png'
    ];

    this.badgeCreatorService.getBadges().subscribe(
        result => {
          this.badgeDataList = result;
        }
    );
  }

  displayUploadedIcon(icon: string) {
    return ImageUtils.decodeDBImage(this.sanitizer, icon);
  }

  create() {
    if (this.badgeIndex === -1) {
      // The user uploaded their image, which we already loaded.
      this.badgeCreatorService.create(
        this.badgeName,
        this.badgeDescription,
          ImageUtils.convertToDBImage(this.uploadedBadgeIcon),
        ).subscribe(() => {
          this.modalController.dismiss();
      });
    }
    else {
      // The user selected one of our images, which we only have a URL to.
      this.badgeCreatorService.createWithFilename(
        this.badgeName,
        this.badgeDescription,
        this.badgeIconPaths[this.badgeIndex])

      this.modalController.dismiss();
    }
  }

  handleIconFileSelect(event) {
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

  dismiss() {
    this.modalController.dismiss();
  }
}
