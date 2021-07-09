import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ClassControllerService} from '../../../../../Providers/class-controller/class-controller.service';
import {GroupControllerService} from '../../../../../Providers/group-controller/group-controller.service';
import {ModalController} from '@ionic/angular';
import {BehaviorSubject, forkJoin} from 'rxjs';
import {UsersService} from '../../../../../Providers/user-controller/users.service';
import {ImageUtils} from '../../../../../utils/image-utils';
import {DomSanitizer} from '@angular/platform-browser';
import {AddGroupModalComponent} from '../../../../../modals/groups/add-group-modal/add-group-modal.component';

@Component({
  selector: 'app-student-assigner',
  templateUrl: './student-assigner.component.html',
  styleUrls: ['./student-assigner.component.scss'],
})
export class StudentAssignerComponent implements OnInit {
  private stage = 0;
  classes: any[];
  groups: any[];
  tab = 'classes';

  private mClassId: number;
  selectedClass: any;
  students: any[];
  groupIds: number[];

  public form: FormGroup;

  private studentDatas: any[];
  private userDatas: any[];

  constructor(
    private classController: ClassControllerService,
    private groupController: GroupControllerService,
    private fb: FormBuilder,
    private modalController: ModalController,
    private userController: UsersService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.classController.getClassesWithTeacherName(
      {uName: localStorage.getItem('logedInUsername')}
    ).subscribe(classes => {
      this.classes = classes;

      this.groups = [];
      this.classes.forEach(clss => {
        this.groupController.getGroupsByClassId(clss.id)
            .subscribe(groups => {
              if (groups) {
                this.groups = this.groups.concat(groups);
                forkJoin(this.groups.map(
                    g => {
                      const subject = new BehaviorSubject(null);
                      this.groupController.getStudentsInGroup(g.id)
                          .subscribe(arr => {
                            g.students = arr;
                            subject.complete();
                          });
                      return subject.asObservable();
                    }
                ));
              }
            });
      });

      this.studentDatas = [];
      this.userDatas = [];

      // this.classes.forEach(clss => {
      //   this.classController.getStudentsWithClassId({id: clss.id})
      //       .subscribe(studentDatas => {
      //         this.studentDatas = [...new Set(this.studentDatas.concat(studentDatas))];
      //         forkJoin(studentDatas.map(s => this.userController.getUser(s.username)))
      //             .subscribe(userDatas => {
      //               this.userDatas = [...new Set(this.userDatas.concat(userDatas))];

      //               this.studentDatas.forEach(st => {
      //                 this.userDatas.forEach(us => {
      //                   if (st.username === us.username){
      //                     us.id = st.id;
      //                   }
      //                 });
      //               });
      //             });

      //         console.log(this.studentDatas);
      //       });
      // });
    });

    this.students = [];
  }

  setTab(ev){
    this.tab = ev.detail.value;

    // TODO: make this persist across tabs
    this.students = [];
  }

  async submit() {
    const studentIds = [];
    this.students.forEach(student => {
        studentIds.push(student.id);
    });

    await this.modalController.dismiss(studentIds);
  }

  handleStudentsAltered(ev){
    console.log(ev);
    console.log(this.students.length);
    const toRemoveInd = [];
    this.students.forEach((st, ind) => {
      console.log('ran');
      if (st.class === ev.class){
        toRemoveInd.push(ind);
      }
    });

    toRemoveInd.reverse().forEach(ind => {
      this.students.splice(ind, 1);
    });

    ev.students.forEach(st => {
      this.students.push(st);
    });

    console.log('new students list', this.students);
  }

  addStudents(students: [any]) {
    if (students && students.length > 0) {
      students.forEach(student => {
        if (!this.isInList(student)) {
          this.students.push(student);
        }
      });
    }
    else {
      this.students = [];
    }
  }

  isInList(student: any) {
    return this.students.indexOf(student) !== -1;
  }

  addSingleStudent(event: any, student: any) {
    if (event.detail.checked && student) {
      if (!this.isInList(student)) {
        this.students.push(student);
      }
    }
    else {
      this.students = this.students.filter(st => st.username !== student.username);
    }

    console.log(this.students);
  }

  getImage(img: any) {
    if (img) {
      return ImageUtils.decodeDBImage(this.sanitizer, ImageUtils.convertDBImage(img));
    }
  }

  async addGroup() {
    const modal = await this.modalController.create({
      component: AddGroupModalComponent,
      cssClass: 'group-modal',
      componentProps: {
        students: this.userDatas,
        classes: this.classes,
        studentToAdd: null,
        groupTitle: null,
        classSelected: null,
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data) {
      this.groups.push(data.group);
    }
  }
}
