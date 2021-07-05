import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-annotation-options',
  templateUrl: './annotation-options.component.html',
  styleUrls: ['./annotation-options.component.scss'],
})
export class AnnotationOptionsComponent implements OnInit {
  showDelete = false;

  constructor(
      public annotationOptions: PopoverController,
      public annotationDelete: PopoverController
  ) { }

  ngOnInit() {}

  delete() {
    this.annotationOptions.dismiss({delete: true});
    // this.presentAnnotationOptions(ev);
  }

  navigate() {
    this.annotationOptions.dismiss({navigate: true});
  }
}
