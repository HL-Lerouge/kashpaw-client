import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreerComptePage } from './creer-compte.page';

const routes: Routes = [
  {
    path: '',
    component: CreerComptePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreerComptePageRoutingModule {}
