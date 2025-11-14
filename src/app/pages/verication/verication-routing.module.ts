import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VericationPage } from './verication.page';

const routes: Routes = [
  {
    path: '',
    component: VericationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VericationPageRoutingModule {}
