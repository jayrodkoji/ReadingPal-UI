import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BadgeCreatorComponent } from 'src/app/Components/badge-creator/badge-creator.component';
import { BadgeControllerService } from 'src/app/Providers/badges/badge-controller.service';
import { BadgeData } from 'src/app/Providers/badges/badge-data';

@Component({
  selector: 'app-award',
  templateUrl: './award.page.html',
  styleUrls: ['./award.page.scss'],
})
export class AwardPage implements OnInit {
  public badgeDataList: BadgeData[];
  creatorsBadgeList: BadgeData[];
  rPBadgeList: BadgeData[];
  deleteAward: boolean = false;

  slideOpts = {
    slidesPerView: 'auto',
  }

  communitySlideOpts = {
    slidesPerView: 'auto',
    slidesPerColumn: 2
  }

  constructor(
    private badgeCreatorService: BadgeControllerService,
    public modalController: ModalController
    ) {}

  ngOnInit() {
    this.creatorsBadgeList = this.rPBadgeList = null;

    // get all badges for the three sections
    this.getBadgesByCreator();
    this.getRPBadges();
    this.getAllBadges();
  }

  /**
   * Get all badges for defined creator
   * Creator in this case is logged-in user
   */
  getBadgesByCreator() {
    console.log("get badges creator")
    this.badgeCreatorService.getCreatorsBadges(localStorage.getItem('logedInUsername')).subscribe(
        result => {
          if(result && result.length > 0)
            this.creatorsBadgeList = result;
        }
    );
  }

  /**
   * Get Reading Pal created badges
   * @private
   */
  private getRPBadges() {
    this.badgeCreatorService.getRPBadges().subscribe(
        result => {
          if(result && result.length > 0)
            this.rPBadgeList = result;
        }
    );
  }

  /**
   * Get all badges
   */
  getAllBadges() {
    this.badgeCreatorService.getBadges().subscribe(
        result => {
          console.log(result)
          this.badgeDataList = result;
        }
    );
  }

  /**
   * Present award creation modal
   */
  createAward() {
    let res = this.awardCreationModal();
  }


  /**
   * Create Award Creation Modal
   */
  async awardCreationModal() {
    const modal = await this.modalController.create({
      component: BadgeCreatorComponent,
      cssClass: 'create-award',
    });

    return await modal.present();
  }

  /**
   * Allow the ability to update award
   * @param badgeData: existing badge data
   */
  updateAward(badgeData: BadgeData) {
    console.log(badgeData)
  }
}
