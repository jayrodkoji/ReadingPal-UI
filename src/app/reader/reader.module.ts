import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReaderPageRoutingModule } from './reader-routing.module';

import { ReaderPage } from './reader.page';
import { TableOfContentsComponent } from './table-of-contents/table-of-contents.component';
import { SettingsComponent } from './settings/settings.component';
import { IonCustomScrollbarModule } from 'ion-custom-scrollbar';
import { WordOptionsComponent } from '../shared/popover/word-options/word-options.component';
import { ImageModalPageModule } from '../modals/image-modal/image-modal.module';
import {SharedModule} from '../shared/shared.module';
import {ColorSelectPageModule} from '../shared/popover/color-select/color-select.module';
import {ReaderControlsPageModule} from '../modals/reader-controls/reader-controls.module';
import {FinishedReadingComponent} from './finished-reading/finished-reading.component';
import {MessageSystemComponent} from '../shared/message-system/message-system.component';



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReaderPageRoutingModule,
        IonCustomScrollbarModule,
        ImageModalPageModule,
        SharedModule,
        ColorSelectPageModule,
        ReaderControlsPageModule
    ],
    exports: [
        MessageSystemComponent
    ],
    declarations: [
        ReaderPage,
        TableOfContentsComponent,
        SettingsComponent,
        WordOptionsComponent,
        FinishedReadingComponent,
        MessageSystemComponent
    ]
})
export class ReaderPageModule {}
