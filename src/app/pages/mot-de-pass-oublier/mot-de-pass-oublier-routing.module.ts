import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MotDePassOublierPage } from './mot-de-pass-oublier.page';

const routes: Routes = [
  {
    path: '',
    component: MotDePassOublierPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MotDePassOublierPageRoutingModule {}
