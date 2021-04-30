import { Component, OnInit } from '@angular/core';
import {BadgeControllerService} from '../../Providers/badges/badge-controller.service';

@Component({
  selector: 'app-badges',
  templateUrl: './badges.page.html',
  styleUrls: ['./badges.page.scss'],
})
export class BadgesPage implements OnInit {
  earnedBadges = [];
  lockedBadges = [];

  constructor(private badgeController: BadgeControllerService) { }

  ngOnInit() {
    this.badgeController.getUsersBadges(localStorage.getItem('logedInUsername'))
      .subscribe(badges => {
        if (badges) {
          this.earnedBadges = badges;

          this.badgeController.getBadges()
            .subscribe(allBadges => {
              if (allBadges) {
                this.lockedBadges = allBadges.filter(
                  o => this.earnedBadges.find(o2 => o2.id === o.id) === undefined
                );
              }
            });
        }
      });
  }

}
