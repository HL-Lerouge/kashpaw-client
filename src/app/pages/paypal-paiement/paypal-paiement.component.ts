import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {ClientService} from "../../services/client.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-paypal-paiement',
  templateUrl: './paypal-paiement.component.html',
  styleUrls: ['./paypal-paiement.component.scss'],
})
export class PaypalPaiementComponent  implements OnInit {

  @Input("montant") montant :any
  info = {
    de: this.authS.session().id,
    a: this.authS.session().id,
    montant: '',
    type : "Paypal"
  }

  constructor(private mdc:ModalController,private cliS:ClientService,private authS:AuthService) {

  }

  ngOnInit() {
    let _this = this;
    setTimeout(() => {
      _this.info.montant=_this.montant
      // Render the PayPal button into #paypal-button-container
      // @ts-ignore
      window?.paypal.Buttons({
        // Set up the transaction
        createOrder: function (data:any, actions:any) {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: _this.montant
              }
            }]
          });
        },
        // Finalize the transaction
        onApprove: function (data:any, actions:any) {
          return actions.order.capture()
            .then(function (details:any) {
              console.log(details)
              // Show a success message to the buyer
              _this.info.montant=_this.montant
              _this.cliS.depot(_this.info).then((result:any)=>{
                _this.close().then(r => console.log("close"));
                alert(result.message);
              },(error:any)=>{
                alert('Transaction completed by ' + details.payer.name.given_name + '!');
              })
            })
            .catch((err: any) => {
              console.log(err);
            })
        }
      }).render('#paypal-button-container');
    }, 500)
  }

  async close(){
    await this.mdc.dismiss();
  }

}
