import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PopoverController} from "@ionic/angular";

@Component({
  selector: 'app-group-options-popover',
  templateUrl: './group-options-popover.component.html',
  styleUrls: ['./group-options-popover.component.scss'],
})
export class GroupOptionsPopoverComponent implements OnInit {

  @Input() group;
  verifyDelete = false;

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private popoverCtrl: PopoverController
  ) { }

  ngOnInit() {}

  onClickDelete() {
    this.verifyDelete = true;
  }

  onClickEdit() {
    this.popoverCtrl.dismiss({ isEdit: true });
  }

  onClickDuplicate() {
    this.popoverCtrl.dismiss({ isEdit: false });
  }

  onDeleteYes() {
    this.popoverCtrl.dismiss({ delete: true });
  }

  onDeleteNo() {
    this.verifyDelete = false;
  }

}
