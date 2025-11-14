import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VericationPageRoutingModule } from './verication-routing.module';

import { VericationPage } from './verication.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VericationPageRoutingModule
  ],
  declarations: [VericationPage]
})
export class VericationPageModule {}
