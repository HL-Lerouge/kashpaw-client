import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'creer-compte',
    loadChildren: () => import('./pages/creer-compte/creer-compte.module').then( m => m.CreerComptePageModule)
  },
  {
    path: 'mot-de-pass-oublier',
    loadChildren: () => import('./pages/mot-de-pass-oublier/mot-de-pass-oublier.module').then( m => m.MotDePassOublierPageModule)
  },
  {
    path: 'principale',
    loadChildren: () => import('./pages/principale/principale.module').then( m => m.PrincipalePageModule)
  },
  {
    path: 'profil',
    loadChildren: () => import('./pages/profil/profil.module').then( m => m.ProfilPageModule)
  },
  {
    path: 'desktop-redirect',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },  {
    path: 'verication',
    loadChildren: () => import('./pages/verication/verication.module').then( m => m.VericationPageModule)
  },


];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
