import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-plus',
  templateUrl: './plus.component.html',
  styleUrls: ['./plus.component.scss'],
})
export class PlusComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {}

  goProfil() {
    this.router.navigateByUrl("profil")
  }

  goHome() {
    this.router.navigateByUrl("principale/resumer")
  }

}
