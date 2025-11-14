import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrincipalePageRoutingModule } from './principale-routing.module';

import { PrincipalePage } from './principale.page';
import {EnvoyerComponent} from "../envoyer/envoyer.component";
import {PayerComponent} from "../payer/payer.component";
import {RecevoirComponent} from "../recevoir/recevoir.component";
import {ResumerComponent} from "../resumer/resumer.component";
import {PlusComponent} from "../plus/plus.component";
import {QRCodeModule} from "angularx-qrcode";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ZXingScannerModule } from '@zxing/ngx-scanner'; // Import ZXingScannerModule


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FontAwesomeModule,
    PrincipalePageRoutingModule,
    QRCodeModule,
    ZXingScannerModule
  ],
  declarations: [PrincipalePage,EnvoyerComponent,PayerComponent,RecevoirComponent,ResumerComponent,PlusComponent]
})
export class PrincipalePageModule {}
