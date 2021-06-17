import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent implements OnInit {
  @Input() rating: number;

  @Output() ratingChange: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  rate(index: number) {
    this.rating = index;
    this.ratingChange.emit(this.rating);
  }

  getColor(index: number) {
    if (this.isAboveRating(index)){
      return "#E0E0E0"; // Grey
    }
    
    return "#FFCA28"; // Yellow
  }

  isAboveRating(index: number): boolean {
    return index > this.rating;
  }

}
