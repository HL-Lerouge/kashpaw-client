import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {ApiService} from "../../services/api.service";
import {ClientService} from "../../services/client.service";
import {Toast} from "@capacitor/toast";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-delete-compte',
  templateUrl: './delete-compte.component.html',
  styleUrls: ['./delete-compte.component.scss'],
})
export class DeleteCompteComponent  implements OnInit {

  session : any;
  constructor(private mdc:ModalController,private apiS:ApiService,private clsS:ClientService,private authS:AuthService) {
    this.session=this.apiS.session();
  }

  ngOnInit() {}

  cancel() {
    return this.mdc.dismiss(null, 'cancel');
  }
  
  deleteCompte() {
    let data = {
      id:this.session.id
    }

    this.clsS.deleteCompte(data).then(async (r)=>{
      localStorage.clear();
      await Toast.show({
        text:"Compte suppriemr avec success"
      })
      await this.authS.signOut();
      await this.cancel();
    },(error)=>{
      Toast.show({
        text:JSON.stringify(error)
      })
    })
    console.log("delete compte")
  }
}
