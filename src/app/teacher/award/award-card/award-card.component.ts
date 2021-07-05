import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BadgeData } from 'src/app/Providers/badges/badge-data';
import { ImageUtils } from 'src/app/utils/image-utils';
import { BadgeControllerService } from '../../../Providers/badges/badge-controller.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-award-card',
  templateUrl: './award-card.component.html',
  styleUrls: ['./award-card.component.scss'],
})
export class AwardCardComponent implements OnInit {
  @Input() award: BadgeData;
  @Input() isSelected: boolean;
  @Input() delete: boolean;
  @Input() owner: boolean;
  @Output() awardDeleted = new EventEmitter();

  constructor(
      private sanitizer: DomSanitizer,
      private http: HttpClient,
      private badgeService: BadgeControllerService) { }

  ngOnInit() {
  }

  getIconImage(data: any) {

    if (data){
      return ImageUtils.decodeDBImage(this.sanitizer, data.icon);
    }

    // We need to have default image for failure
    alert('Could not load image icon');
    return null;
  }

  deleteAward(id) {
    console.log(id);

    this.badgeService.deleteBadgeIcon(id).subscribe(res => {
      console.log('delete', res);
      this.awardDeleted.emit();
    });
  }
}
