import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import {ApiService} from "../services/api.service";
import {HttpClient} from "@angular/common/http";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FontAwesomeModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage],
  providers:[ApiService,HttpClient],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePageModule {}
