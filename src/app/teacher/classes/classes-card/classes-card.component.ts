import {Component, HostListener, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ModalController, PopoverController} from '@ionic/angular';
import {AddGroupModalComponent} from '../../../modals/groups/add-group-modal/add-group-modal.component';
import {GroupOptionsPopoverComponent} from '../group-options-popover/group-options-popover.component';
import {GroupControllerService} from '../../../Providers/group-controller/group-controller.service';

const XS = 581;
const SM = 890;
const MD = 1050;

@Component({
  selector: 'app-classes-card',
  templateUrl: './classes-card.component.html',
  styleUrls: ['./classes-card.component.scss'],
})
export class ClassesCardComponent implements OnInit, OnChanges {
  @Input() classes;
  @Input() groups;
  @Input() group;
  @Input() users;
  classesLoading = true;
  numStudentsDisplayed: number;
  slideOptions: any;

  constructor(
      private modalController: ModalController,
      private popoverController: PopoverController,
      private groupController: GroupControllerService
  ) { }


  ngOnInit() {
    this.setNumStudentsDisplayed(window.innerWidth);

    this.slideOptions = {
      slidesPerView: this.numStudentsDisplayed,
      zoom: false,
      grabCursor: true
    };
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setNumStudentsDisplayed(window.innerWidth);
  }

  setNumStudentsDisplayed(windowWidth) {
    if (windowWidth) {
      if (windowWidth < 480) {
        this.numStudentsDisplayed = 2;
      }
      else if (windowWidth < XS) {
        this.numStudentsDisplayed = 3;
      }
      else if (windowWidth < SM) {
        this.numStudentsDisplayed = 4;
      }
      else if (windowWidth < MD) {
        this.numStudentsDisplayed = 5;
      }
      else {
        this.numStudentsDisplayed = 5;
      }

      this.slideOptions = {
        slidesPerView: this.numStudentsDisplayed,
        zoom: false,
        grabCursor: true
      };
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.classes) {
      this.classes = changes.classes.currentValue;
    }
    if (changes.groups) {
      this.groups = changes.groups.currentValue;
    }
  }

  async addGroup(group) {
    const modal = await this.modalController.create({
      component: AddGroupModalComponent,
      cssClass: 'group-modal',
      componentProps: {
        students: this.users,
        classes: this.classes,
        studentToAdd: group ? group.students : null,
        groupTitle: group ? group.name : null,
        classSelected: group ? group.class_id : null,
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      this.groups.push(data.group);
    }
  }

  async groupOptionsPopover(ev: any, group, index) {
    const popover = await this.popoverController.create({
      component: GroupOptionsPopoverComponent,
      cssClass: 'lesson-options-popover',
      event: ev,
      mode: 'ios',
      componentProps: {
        group,
      }
    });
    await popover.present();

    const {data} = await popover.onDidDismiss();
    if (data) {
      if (data.delete) {
        await this.onClickDelete(index, group);
      } else {
        this.addGroup(group);
      }
    }
  }

  async onClickDelete(index, group) {
    this.groups.splice(index, 1);
    this.groupController.deleteGroup(group.class_id, group.id)
        .subscribe(() => {});
  }
}
