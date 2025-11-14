import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrincipalePage } from './principale.page';
import {EnvoyerComponent} from "../envoyer/envoyer.component";
import {PayerComponent} from "../payer/payer.component";
import {RecevoirComponent} from "../recevoir/recevoir.component";
import {ResumerComponent} from "../resumer/resumer.component";
import {PlusComponent} from "../plus/plus.component";
import {ProfilPage} from "../profil/profil.page";

const routes: Routes = [
  {
    path: '',
    component: PrincipalePage,
    children : [
      {
        path : 'envoyer',
        component : EnvoyerComponent
      },
      {
        path : 'payer',
        component : PayerComponent
      },
      {
        path : 'recevoir',
        component : RecevoirComponent
      },
      {
        path : 'resumer',
        component : ResumerComponent
      },
      {
        path : 'plus',
        component : PlusComponent
      },
      {
        path : 'profil',
        component : ProfilPage
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrincipalePageRoutingModule {}
