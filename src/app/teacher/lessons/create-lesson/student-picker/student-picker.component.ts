import {Component, Input, OnInit} from '@angular/core';
import {ClassControllerService} from '../../../../Providers/class-controller/class-controller.service';
import {GroupControllerService} from '../../../../Providers/group-controller/group-controller.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ModalController} from '@ionic/angular';
import {GroupPickerComponent} from '../group-picker/group-picker.component';

@Component({
  selector: 'app-student-picker',
  templateUrl: './student-picker.component.html',
  styleUrls: ['./student-picker.component.scss'],
})
export class StudentPickerComponent implements OnInit {
  // Parent form, must have "students" control.
  @Input() form: FormGroup;
  @Input() studentDatas: any[];
  @Input() userDatas: any[];

  static generateStudentFormArray(
    fb: FormBuilder, studentDatas: any[], userDatas: any[]): FormArray {
    return fb.array(studentDatas.map(
      s => fb.group({
        selected: [false]
      })
    ));
  }

  constructor(
    //private controlContainer: ControlContainer,
    private modalController: ModalController,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

  }

  get studentControls() {
    return (this.form.controls.students as FormArray).controls;
  }

  submit() {
    this.modalController.dismiss();
  }

  selectAll() {
    const studentControls = this.studentControls;
    for (let i = 0; i < this.studentControls.length; i++) {
      (this.studentControls[i] as FormGroup).controls.selected.setValue(true);
    }
  }
}
