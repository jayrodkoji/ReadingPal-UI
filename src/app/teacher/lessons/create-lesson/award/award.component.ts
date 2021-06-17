import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BadgeCreatorComponent } from 'src/app/shared/badge-creator/badge-creator.component';
import {BadgeRowComponent} from '../../../../shared/badge-row/badge-row.component';

@Component({
  selector: 'app-award',
  templateUrl: './award.component.html',
  styleUrls: ['./award.component.scss'],
})
export class AwardComponent implements OnInit, AfterViewInit {
  @ViewChild(BadgeRowComponent)
  private badgeRowComponent: BadgeRowComponent;

  private mInitialBadge;

  constructor(public modalController: ModalController) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    if (this.mInitialBadge) {
      this.badgeRowComponent.setSelectedId(this.mInitialBadge.id);
    }
  }

  @Input()
  set initialBadge(badge: any) {
    if (badge) {
      this.mInitialBadge = badge;
      if (this.badgeRowComponent) {
        this.badgeRowComponent.setSelectedId(this.mInitialBadge.id);
      }
    }
  }

  getSelectedBadgeId(): number {
    return this.badgeRowComponent.selectedBadgeId;
  }

  createAward() {
    this.presentModal();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: BadgeCreatorComponent,
      cssClass: 'my-custom-class'
    });

    await modal.present();
  }
}
