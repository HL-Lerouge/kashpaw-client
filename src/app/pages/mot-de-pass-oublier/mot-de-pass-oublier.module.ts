import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MotDePassOublierPageRoutingModule } from './mot-de-pass-oublier-routing.module';

import { MotDePassOublierPage } from './mot-de-pass-oublier.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MotDePassOublierPageRoutingModule
  ],
  declarations: [MotDePassOublierPage]
})
export class MotDePassOublierPageModule {}
