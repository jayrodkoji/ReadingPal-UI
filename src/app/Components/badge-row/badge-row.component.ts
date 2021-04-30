import {Component, Input, OnInit} from '@angular/core';
import { BadgeControllerService } from 'src/app/Providers/badges/badge-controller.service';
import { BadgeData } from 'src/app/Providers/badges/badge-data';
import { LessonService } from 'src/app/Providers/lesson-services/lesson.service';

@Component({
  selector: 'app-badge-row',
  templateUrl: './badge-row.component.html',
  styleUrls: ['./badge-row.component.scss'],
})
export class BadgeRowComponent implements OnInit {
  @Input() lessonId: number;
  @Input() canSelect = false;

  slideOpts = {
    slidesPerView: 'auto',
  };

  public badgeDataList: BadgeData[];
  public selectedBadgeId = null;

  selectedBadgeIndex = null;

  constructor(
    private badgeCreatorService: BadgeControllerService,
    private lessonService: LessonService) { }

  ngOnInit() {
    this.getBadges();
  }

  getBadges() {
    if (this.lessonId === undefined) {
      this.badgeCreatorService.getBadges().subscribe(
        result => {
          if (result) {
            this.badgeDataList = result;
            if (this.selectedBadgeId) {
              this.setSelectedId(this.selectedBadgeId);
            }
          }
        }
      );
    }
    else {
      this.lessonService.getLessons().subscribe(
        result => {
          if (result !== null) {
            if (typeof(this.lessonId) === 'string') {
              this.lessonId = parseInt(this.lessonId, 10);
            }
            const lesson = result.find(o => o.id === this.lessonId);
            const badgeId = lesson.badgeId;
          }
        }
      );
    }
  }

  getBadge(badgeId: number) {
    if (badgeId !== null) {
      if (typeof(badgeId) === 'string') {
        badgeId = parseInt(badgeId, 10);
      }
      this.badgeCreatorService.getBadgeDataList().subscribe(
        res2 => {
          if (res2 !== null) {
            this.badgeDataList = [res2.find(o => o.id === badgeId)];
          }
        }
      );
    }
    else {
      this.badgeDataList = [];
    }
  }

  selected(index: number) {
    if (this.selectedBadgeIndex === index) {
      this.selectedBadgeIndex = null;
      this.selectedBadgeId = null;
    }
    else {
      this.selectedBadgeIndex = index;
      this.selectedBadgeId = this.badgeDataList[index].id;
    }
  }

  setSelectedId(id: number) {
    this.selectedBadgeId = id;
    if (this.badgeDataList) {
      this.selectedBadgeIndex = this.badgeDataList.findIndex(badge => badge.id === id);
    }
  }

}
