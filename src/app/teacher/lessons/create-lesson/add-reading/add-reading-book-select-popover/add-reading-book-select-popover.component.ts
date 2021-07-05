import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-add-reading-book-select-popover',
  templateUrl: './add-reading-book-select-popover.component.html',
  styleUrls: ['./add-reading-book-select-popover.component.scss'],
})
export class AddReadingBookSelectPopoverComponent implements OnInit {
  @Input('books') books;
  selectedInd = -1;
  searchText: any;
  selectedBookId: any;

  constructor(
      private modalController: ModalController
  ) { }

  ngOnInit() {
    this.books.sort((a, b) => a.title.localeCompare(b.title));
  }

  dismiss() {
    this.modalController.dismiss(this.selectedBookId);
  }
}
