import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {ApiService} from "./services/api.service";
import {CreerComptePageModule} from "./pages/creer-compte/creer-compte.module";
import {PaypalPaiementComponent} from "./pages/paypal-paiement/paypal-paiement.component";
import {InAppBrowser} from "@ionic-native/in-app-browser/ngx";
import {ContactsComponent} from "./pages/contacts/contacts.component";
import {ChangePinComponent} from "./pages/change-pin/change-pin.component";
import {PinPageComponent} from "./pages/pin-page/pin-page.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SingleTransactionComponent} from "./pages/single-transaction/single-transaction.component";
import { MaskitoDirective } from '@maskito/angular';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import {DeleteCompteComponent} from "./pages/delete-compte/delete-compte.component";
import { ZXingScannerModule } from '@zxing/ngx-scanner';


@NgModule({
  declarations: [AppComponent,PaypalPaiementComponent,ContactsComponent,ChangePinComponent,PinPageComponent,SingleTransactionComponent,DeleteCompteComponent],
  imports: [MaskitoDirective,BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, CreerComptePageModule, ReactiveFormsModule, FormsModule, FontAwesomeModule, ZXingScannerModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    HttpClient,ApiService,InAppBrowser
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
		library.addIconPacks(fas, fab, far);
	}
}
