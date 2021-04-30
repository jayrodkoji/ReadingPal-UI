import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReaderControlsPageRoutingModule } from './reader-controls-routing.module';

import { ReaderControlsPage } from './reader-controls.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReaderControlsPageRoutingModule
    ],
    exports: [
        ReaderControlsPage
    ],
    declarations: [ReaderControlsPage]
})
export class ReaderControlsPageModule {}
