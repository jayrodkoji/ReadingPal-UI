import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChapterSelectPopoverPageRoutingModule } from './chapter-select-popover-routing.module';

import { ChapterSelectPopoverPage } from './chapter-select-popover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChapterSelectPopoverPageRoutingModule
  ],
  declarations: [ChapterSelectPopoverPage]
})
export class ChapterSelectPopoverPageModule {}
