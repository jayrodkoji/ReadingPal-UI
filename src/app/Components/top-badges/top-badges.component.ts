import { Component, OnInit,  Input } from '@angular/core';
import {ImageUtils} from '../../rp-utils/image-utils';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-top-badges',
  templateUrl: './top-badges.component.html',
  styleUrls: ['./top-badges.component.scss'],
})
export class TopBadgesComponent implements OnInit {
  @Input() badges: any[];

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {}

  getIconImage(data) {
    return ImageUtils.decodeDBImage(this.sanitizer, data.icon);
  }

}
