import {Component, Input, OnInit} from '@angular/core';
import {ControlContainer, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {StudentPickerComponent} from '../student-picker/student-picker.component';
import {GroupControllerService} from '../../../../Providers/group-controller/group-controller.service';
import {BehaviorSubject, forkJoin, Observable, Subject} from 'rxjs';

@Component({
  selector: 'app-group-picker',
  templateUrl: './group-picker.component.html',
  styleUrls: ['./group-picker.component.scss'],
})
export class GroupPickerComponent implements OnInit {
  @Input() groups;

  // Form must have "groupIds" array field.
  @Input() form: FormGroup;
  @Input() studentDatas: any[];
  @Input() userDatas: any[];
  @Input() classId: number;

  innerForm: FormGroup;
  addingGroup = false;

  static generateGroupFormArray(
    fb: FormBuilder, groups: any[]): FormArray {
    return fb.array(groups.map(
      s => fb.group({
        selected: [false]
      })
    ));
  }

  constructor(
    //private controlContainer: ControlContainer,
    private modalController: ModalController,
    private fb: FormBuilder,
    private groupController: GroupControllerService
  ) { }

  ngOnInit() {
    const groupIds = this.form.controls.groupIds as FormArray;
    //this.form = this.controlContainer.control as FormGroup;
    this.innerForm = this.fb.group({
      /*groups: this.fb.array(this.groups.map(
        g => this.fb.group({
          selected: [groupIds.value.find(i => i === g.id) !== undefined],
          id: [g.id]
        })
      )),*/
      newGroup: this.createNewGroupControl()
    });
  }

  addGroup() {
    this.addingGroup = true;
  }

  saveGroup() {
    const newGroup = this.innerForm.controls.newGroup.value;
    const newGroupStudents = [];
    this.groupController.addGroup(this.classId, newGroup.groupName)
      .subscribe(o => {
        forkJoin(newGroup.students.map((obj, i) => {
          if (obj.selected) {
            const subject = new Subject();
            newGroupStudents.push(this.studentDatas[i].id.toString());
            this.groupController.addStudentToGroup(
              o.id, this.studentDatas[i].id)
              .subscribe(group => {
                subject.next(group);
                subject.complete();
              });
            return subject.asObservable();
          }
          else {
            const subject = new BehaviorSubject(null);
            subject.complete();
            return subject.asObservable();
          }
        })).subscribe(arr => {

        }, err => {
          console.log(err);
        }, () => {
          (this.form.controls.groups as FormArray).insert(0, this.fb.group({
            selected: [false],
            id: [o.id]
          }));
          const obj = o as any;
          obj.students = newGroupStudents;
          this.groups.splice(0, 0, obj);
          this.addingGroup = false;
          this.innerForm.controls.newGroup = this.createNewGroupControl();
        });
      });

  }

  createNewGroupControl() {
    return this.fb.group({
      groupName: ['', [Validators.required, Validators.minLength(1)]],
      students: StudentPickerComponent.generateStudentFormArray(
        this.fb, this.studentDatas, this.userDatas)
    });
  }

  getNewGroupForm(): FormGroup {
    return this.innerForm.controls.newGroup as FormGroup;
  }

  async newGroupSelectStudents() {
    const modal = await this.modalController.create({
      component: StudentPickerComponent,
      componentProps: {
        form: this.innerForm.controls.newGroup,
        studentDatas: this.studentDatas,
        userDatas: this.userDatas
      }
    });

    await modal.present();
  }

  async submit() {
    await this.modalController.dismiss();
  }

  onClickDelete(i: number) {
    this.groupController.deleteGroup(this.classId, this.groups[i].id)
      .subscribe(res => {
        this.groups.splice(i, 1);
        (this.form.controls.groups as FormArray).removeAt(i);
      });
  }

}
