import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreerComptePageRoutingModule } from './creer-compte-routing.module';

import { CreerComptePage } from './creer-compte.page';
import {MaskitoDirective} from "@maskito/angular";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreerComptePageRoutingModule,
    MaskitoDirective
  ],
  declarations: [CreerComptePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CreerComptePageModule {}
