import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LessonCreatorService } from '../../Providers/teacher/lesson-creator.service';
import { LessonPostData } from '../../Providers/lesson-services/lesson-services-models/lesson-post-data';
import { LessonData } from '../../Providers/lesson-services/lesson-services-models/lesson-data';

@Component({
  selector: 'app-lesson-creator',
  templateUrl: './lesson-creator.component.html',
  styleUrls: ['./lesson-creator.component.scss'],
})
export class LessonCreatorComponent implements OnInit {
  @Output() creationEvent = new EventEmitter<LessonData>();

  bookID: number;
  creator: string;
  level: string;
  chapter: string;
  startPage: string;
  endPage: string;
  title: string;
  wordCount: number;
  badgeId: number;
  rating: string;
  sequence: number;
  viewable: boolean;

  constructor(private service: LessonCreatorService) { }

  ngOnInit() {}

  create() {
    this.service.submit(
      new LessonPostData(
        this.bookID,
        this.creator,
        this.level,
        this.chapter,
        this.startPage,
        this.endPage,
        this.rating,
        this.title,
        this.wordCount,
        this.sequence,
        this.viewable,
        this.badgeId))
      .subscribe(
      next => {
        // console.log(next);
        this.creationEvent.emit(new LessonData(next));
      }
    );
  }
}
