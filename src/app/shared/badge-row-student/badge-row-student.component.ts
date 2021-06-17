import { Component, Input, OnInit } from '@angular/core';
import { BadgeControllerService } from 'src/app/Providers/badges/badge-controller.service';
import { BadgeData } from 'src/app/Providers/badges/badge-data';

@Component({
  selector: 'app-badge-row-student',
  templateUrl: './badge-row-student.component.html',
  styleUrls: ['./badge-row-student.component.scss'],
})
export class BadgeRowStudentComponent implements OnInit {

  @Input() inputStudent;

  public badgeDataList: BadgeData[];

  slideOpts = {
    slidesPerView: 'auto',
  };

  constructor(private badgeController: BadgeControllerService) { }

  ngOnInit() {
    console.log(this.inputStudent);
    this.getBadges();
  }

  getBadges() {
    this.badgeController.getUsersBadges(this.inputStudent).subscribe((result) => {
      if (result) {
        this.badgeDataList = result;
        console.log(this.badgeDataList);
      }
    });
  }

}
