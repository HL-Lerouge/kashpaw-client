import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ClientService} from "../../services/client.service";
import {ApiService} from "../../services/api.service";
import {ChangePinComponent} from "../change-pin/change-pin.component";
import {ModalController} from "@ionic/angular";
import {DeleteCompteComponent} from "../delete-compte/delete-compte.component";

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  statut: string = 'actif';
  compte : any;
  session : any;
  constructor(private router:Router,private cliS:ClientService,private apiS:ApiService,private modalController:ModalController) {
    this.session=this.apiS.session();
  }

  ngOnInit() {
    this.getCompte();
    this.statut = localStorage.getItem("etat") || 'actif';

  }
  showBalance = false; // Par défaut, la valeur est cachée

  toggleBalance() {
    this.showBalance = !this.showBalance;
  }
  getCompte(){
    this.cliS.getCompte(this.session?.id).then(r=>{
      this.compte=r;
      console.log(this.compte)
    })
  }

  deconnecter() {
    localStorage.clear();
    this.router.navigateByUrl("home")
  }

  async pinoublier() {
    const modal = await this.modalController.create({
      component: ChangePinComponent,
    })
    await modal.present();
  }

  async deleteCompte() {
    const modal = await this.modalController.create({
      component: DeleteCompteComponent,
    })
    await modal.present();
  }
}
