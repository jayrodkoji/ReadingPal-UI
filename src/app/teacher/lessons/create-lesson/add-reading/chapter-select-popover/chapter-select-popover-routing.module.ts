import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChapterSelectPopoverPage } from './chapter-select-popover.page';

const routes: Routes = [
  {
    path: '',
    component: ChapterSelectPopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChapterSelectPopoverPageRoutingModule {}
