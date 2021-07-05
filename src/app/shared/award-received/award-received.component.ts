import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BadgeControllerService} from '../../Providers/badges/badge-controller.service';
import {DomSanitizer} from '@angular/platform-browser';
import {ImageUtils} from '../../utils/image-utils';
import {ModalController} from '@ionic/angular';
import {Animation, AnimationController} from '@ionic/angular';

@Component({
  selector: 'app-award-received',
  templateUrl: './award-received.component.html',
  styleUrls: ['./award-received.component.scss'],
})
export class AwardReceivedComponent implements OnInit, AfterViewInit {
  @ViewChild('stage1') stage1Element: any;
  @ViewChild('stage2') stage2Element: any;

  badgeId: number;
  badge: any;
  stage = 1;

  static async presentAsModal(modalController: ModalController, badgeId: number) {
    const modal = await modalController.create({
      component: AwardReceivedComponent,
      componentProps: {
        badgeId
      },
      backdropDismiss: false
    });

    await modal.present();
  }

  constructor(
    private badgeController: BadgeControllerService,
    private sanitizer: DomSanitizer,
    private modalController: ModalController,
    private animationController: AnimationController
  ) { }

  ngOnInit() {
    this.badgeController.getBadgeById(this.badgeId.toString())
      .subscribe((badges: any[]) => {
        if (badges !== null && badges.length > 0) {
          const badge = badges[0];
          this.badge = badge;
          this.badge.icon = ImageUtils.fullDecode(
            this.sanitizer, this.badge.icon);
        }
      });
    setTimeout(() => {
      this.stage = 2;
    }, 750);
  }

  ngAfterViewInit() {
    this.playAnimations();
  }

  async playAnimations() {
    const duration = 2000;
    const stage1 = this.animationController.create()
      .addElement(this.stage1Element.el)
      .duration(duration)
      .keyframes([
        { offset: 0, opacity: '0' },
        { offset: 0.5, opacity: '1' },
        { offset: 1, opacity: '1' }
      ]);
    const stage2 = this.animationController.create()
      .addElement(this.stage2Element.nativeElement)
      .duration(duration)
      .keyframes([
        { offset: 0, opacity: '0' },
        { offset: 0.5, opacity: '0' },
        { offset: 1, opacity: '1' }
      ]);

    stage1.play();
    stage2.play();
  }

  onClick() {
    if (this.stage === 1) {
      this.stage += 1;
    }
  }

  onDismiss() {
    this.modalController.dismiss();
  }

}
