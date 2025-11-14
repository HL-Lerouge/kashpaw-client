import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-principale',
  templateUrl: './principale.page.html',
  styleUrls: ['./principale.page.scss'],
})
export class PrincipalePage implements OnInit {

  statut: string = 'papa';

  constructor(private router:Router) {
  

   }

  ngOnInit() {

    this.statut = localStorage.getItem("etat") || 'actif';

    this.router.navigateByUrl("principale/resumer")
  }


  actif = "resumer";

  isActive = false;

  isTrans = false;

  clickTab(value:any) {
    this.actif=value;
  }

  toggleActive() {
    this.isActive = !this.isActive;
  }

  toggleTrans() {
    this.isTrans = !this.isTrans;
  }
}
