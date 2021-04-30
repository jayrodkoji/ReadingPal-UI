import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ColorSelectPageRoutingModule } from './color-select-routing.module';

import { ColorSelectPage } from './color-select.page';
import { ColorSketchModule } from 'ngx-color/sketch';
import { ColorAlphaModule } from 'ngx-color/alpha';
import { ColorChromeModule } from 'ngx-color/chrome'; // <color-chrome></color-chrome>
import { ColorCircleModule } from 'ngx-color/circle'; // <color-circle></color-circle>

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ColorSelectPageRoutingModule,
    ColorSketchModule,
    ColorAlphaModule,
    ColorChromeModule,
    ColorCircleModule,
  ],
  declarations: [ColorSelectPage]
})
export class ColorSelectPageModule {}
