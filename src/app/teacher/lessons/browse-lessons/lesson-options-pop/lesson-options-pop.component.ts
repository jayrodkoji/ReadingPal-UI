import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {PopoverController} from "@ionic/angular";

@Component({
  selector: 'app-lesson-options-pop',
  templateUrl: './lesson-options-pop.component.html',
  styleUrls: ['./lesson-options-pop.component.scss'],
})
export class LessonOptionsPopComponent implements OnInit {
  @Input() lesson;
  @Input() canDelete;
  verifyDelete = false;

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private popoverCtrl: PopoverController
      ) { }

  ngOnInit() {}

  colSize() {
    return this.canDelete ? 4 : 12;
  }

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
