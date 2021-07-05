import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {ImageUtils} from '../../../utils/image-utils';
import {DomSanitizer} from '@angular/platform-browser';
import {GroupControllerService} from '../../../Providers/group-controller/group-controller.service';

@Component({
  selector: 'app-add-group-modal',
  templateUrl: './add-group-modal.component.html',
  styleUrls: ['./add-group-modal.component.scss'],
})
export class AddGroupModalComponent implements OnInit {
  @Input() students;
  @Input() classes;
  @Input() studentToAdd;
  @Input() groupTitle: any;
  @Input() classSelected: any;

  constructor(
      private modalController: ModalController,
      private groupController: GroupControllerService,
      private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    if (!this.studentToAdd) {
      this.studentToAdd = [];
    }
  }

  isInList(student: any) {
    return this.studentToAdd.indexOf(student) != -1;
  }

  addSingleStudent(event: any, student: any) {
    if (event.detail.checked && student) {
      if (!this.isInList(student)) {
        this.studentToAdd.push(student);
      }
    }
    else {
      this.studentToAdd = this.studentToAdd.filter(st => st.username != student.username);
    }
  }

  getImage(img: any) {
    if (img) {
      return ImageUtils.decodeDBImage(this.sanitizer, ImageUtils.convertDBImage(img));
    }
  }

  submit() {
    this.groupController.addGroup(this.classSelected, this.groupTitle)
        .subscribe((res) => {
          if (res) {
            const groupId = res.id;

            this.studentToAdd.forEach(st => {
              this.groupController.addStudentToGroup(groupId, st.id).subscribe((res) => {
              });
            });

            const data = {group: {class_id: this.classSelected, id: groupId, name: this.groupTitle, students: this.studentToAdd}};
            this.modalController.dismiss(data);

          }
        });
  }
}
