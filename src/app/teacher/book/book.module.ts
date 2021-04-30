import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookPageRoutingModule } from './book-routing.module';

import { BookPage } from './book.page';
import {AddBookModalComponent} from "./add-book-modal/add-book-modal.component";
import {FileUploadModule} from "ng2-file-upload";
import {DragDropDirectiveDirective} from "../../Directives/drag-drop-directive.directive";
import {NgxFileDropModule} from "ngx-file-drop";
import {SharedModuleModule} from "../../shared-module/shared-module.module";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookPageRoutingModule,
    FileUploadModule,
    NgxFileDropModule,
    SharedModuleModule
  ],
  declarations: [BookPage, AddBookModalComponent, DragDropDirectiveDirective]
})
export class BookPageModule {}
