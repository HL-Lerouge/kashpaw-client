import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AlertController, ModalController, Platform} from "@ionic/angular";
import {ClientService} from "../../services/client.service";
import {cube} from "ionicons/icons";
import {Contacts} from '@capacitor-community/contacts';
import {ContactsComponent} from "../contacts/contacts.component";
import {SingleTransactionComponent} from "../single-transaction/single-transaction.component";
import {BarcodeScanner} from "@capacitor-community/barcode-scanner";
import {AuthService} from "../../services/auth.service";
import {Toast} from "@capacitor/toast";

@Component({
  selector: 'app-envoyer',
  templateUrl: './envoyer.component.html',
  styleUrls: ['./envoyer.component.scss'],
})
export class EnvoyerComponent implements OnInit {

  etap: any;
  session: any
  numero_a = ""
  montant_a =500;


  infoTransfert = {
    de: "",
    a: "",
    montant: 0,
    frais : 0,
    montant_total : 0
  }

  comptePrincipale: any
  compteRechercher: any

  recentsTransction: any
  contacts: any
  frais_transaction : any
  http: any;


  constructor(private router: Router, private alertController: AlertController, private cliS: ClientService,
              private modalController: ModalController,private authS:AuthService) {
    Contacts.requestPermissions().then(r => {

    })
  }

  ionViewWillEnter(){
    this.frais_transaction=this.authS.session()?.frais_transaction?.transfert;
  }

  ionViewWillLeave(){
    this.stopScanner()
  }

  async ngOnInit() {
    this.etap = 1;
    this.session = localStorage.getItem("session");
    this.session = JSON.parse(this.session);
    this.infoTransfert.de = this.session.user.id;
    this.recentTransaction()
  }

  recentTransaction() {
    this.cliS.historique(this.session.user?.id).then((response: any) => {
      this.recentsTransction = response.reverse();
    })
  }

  goProfil() {
    this.router.navigateByUrl("profil")
  }

  goHome() {
    this.router.navigateByUrl("principale/resumer")
  }
  showCustomToast(message: string, type: 'success' | 'error') {
    const toast = document.createElement('div');
    toast.innerHTML = message;
    
    toast.className = type === 'success' ? 'toast-success' : 'toast-error';
    
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.padding = '15px';
    toast.style.borderRadius = '5px';
    toast.style.zIndex = '1000';
    toast.style.color = 'white';
    
    toast.style.backgroundColor = type === 'success' ? '#c3facf' : '#f8e404';

    document.body.appendChild(toast);
  
    setTimeout(() => {
      toast.remove();
    }, 5000);
  }

  back1() {

    this.cliS.getCompteByNumber(this.numero_a).then((response: any) => {
      if(this.session?.id===response?.id_client){
        this.showCustomToast("Imposible de continuer la transaction", "error")
        return;
      }
      this.infoTransfert.a = response?.id_client
      this.compteRechercher = response;
      console.log(this.compteRechercher)
      this.etap = 1;
    }, (error: any) => {
      this.presenteAlert("", "Compte introuvable")
      
    })

    this.cliS.getCompte(this.session?.id).then((res: any) => {
      this.comptePrincipale = res
    }, (error: any) => {
    })
  }


  back2() {

    this.cliS.getCompteByNumber(this.numero_a).then((response: any) => {
      if(this.session?.id===response?.id_client){
        this.showCustomToast("Imposible de continuer la transaction", "error")
        return;
      }
      this.infoTransfert.a = response?.id_client
      this.compteRechercher = response;
      console.log(this.compteRechercher)
      this.etap = 2;
    }, (error: any) => {
      this.presenteAlert("", "Compte introuvable")
    })

    this.cliS.getCompte(this.session?.id).then((res: any) => {
      this.comptePrincipale = res
    }, (error: any) => {
    })
  }




  suivant() {

    this.cliS.getCompteByNumber(this.numero_a).then((response: any) => {
      if (this.session?.id === response?.id_client) {
        this.showCustomToast("Impossible de continuer la transaction", "error");
        return;
      }
      this.infoTransfert.a = response?.id_client;
      this.compteRechercher = response;
      console.log(this.compteRechercher);
      this.etap = 2;
    }, async (error: any) => {
      // Show a popup with an input field and buttons
      const alert = await this.alertController.create({
        header: 'Compte non trouvé',
        message: 'Voulez-vous continuer la transaction avec ce numéro de téléphone? un nouveau compte sera crée.',
        inputs: [
          {
            name: 'amount',
            type: 'number',
            placeholder: 'Montant',
            min: 1, // Minimum value allowed
          },
        ],
        buttons: [
          {
            text: 'Annuler',
            role: 'cancel',
            handler: () => {
              console.log('Transaction annulée');
            },
          },
          {
            text: 'Valider',
            handler: async (data) => {
              if (data.amount && data.amount > 0) {
                console.log('Montant validé:', data.amount);
    
                // Prepare the request payload
                const payload = {
                  telephone: this.numero_a, // Phone number from the previous form
                  amount: data.amount, // Amount entered in the popup
                  ...this.infoTransfert, // Include previous form data
                };
    
                // Send the request to the endpoint
                try {
                  const token = localStorage.getItem('token'); // Replace with your actual Bearer token
                  const response = await fetch('https://kashpaw.net/api/transfert2', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                  });
    
                  if (!response.ok) {
                    throw new Error('Erreur lors de l\'envoi de la requête');
                  }
    
                  const result = await response.json();
                  console.log('Réponse du serveur:', result);
                  this.showCustomToast('Transaction réussie', 'success');
                  return true; // Allow the popup to close
                } catch (err) {
                  console.error('Erreur:', err);        
                  this.showCustomToast('Erreur lors de la transaction', 'error');
                  if (error.status === 401) {
                    // Handle unauthorized error (e.g., redirect to login page)
                    console.error("Unauthorized. Redirecting to login...");
                    this.router.navigateByUrl("/home");
                  }
                  return false; // Prevent the popup from closing
                }
              } else {
                console.log('Montant invalide');
                return false; // Prevent the popup from closing
              }
            },
          },
        ],
      });
    
      await alert.present();
    });
    this.cliS.getCompte(this.session?.id).then((res: any) => {
      this.comptePrincipale = res
    }, (error: any) => {
    })
  }
 
  suivant2() {
     this.cliS.getfrais(this.montant_a).then((response: any) => {
      this.infoTransfert.montant = this.montant_a;
    this.infoTransfert.frais=response.otc
    this.infoTransfert.montant_total=this.montant_a+this.infoTransfert.frais;
    console.log(this.infoTransfert);
    this.etap = 3
    }, (error: any) => {
      this.presenteAlert("", "Erreur lors de la récupération des frais")
    })


    
  }

  async presenteAlert(header: any, message: any) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: header,
      subHeader: '',
      message: message,
      buttons: [
        {
          text: 'OK',
          cssClass: 'primary',
        }
      ],
    });
    await alert.present();
  }

  async confirmer() {
    this.cliS.transfert((this.infoTransfert)).then((response: any) => {
      this.numero_a="";
      this.etap = 1;
      this.recentTransaction();
      this.presenteAlert("Succès", "Transfert effectué avec succès")
      this.router.navigateByUrl("principale/resumer")
    }, (error: any) => {
      this.presenteAlert("Erreur", error?.message)
    })
  }

  protected readonly cube = cube;

  async clickKontak() {
    const modal = await this.modalController.create({
      component: ContactsComponent,
      componentProps: {contacts: this.contacts}
    })
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      let d=data.replace(/\s+/g, '');
      this.numero_a=d.replace("+509",'');
    }
  }

  async viewTransaction(t: any) {
    const modal = await this.modalController.create({
      component: SingleTransactionComponent,
      componentProps: {transactions: t}
    })
    await modal.present();
  }

  scannActiv = false;

  async startSanner() {
    // @ts-ignore
    document.querySelector('body').classList.add('scanner-active');
    //if (this.platform.is('capacitor')) {
    this.numero_a = "";
    this.scannActiv = true;
    const alowed = await this.checkPermision();
    if (alowed) {
      //this.openFlash();
      await BarcodeScanner.hideBackground();
      BarcodeScanner.startScan().then(
        (data) => {
          if (data.hasContent) {
            this.stopScanner()
            //this.offFlash();
            this.numero_a = data.content;
            this.scannActiv = false;
            //this.etap=2;
            this.suivant();
          }
        }, (error) => {
          this.stopScanner()
          //this.offFlash();
          console.log(error);
        }
      );
    }
    //  }
  }

  // @ts-ignore
  async checkPermision() {
      return new Promise(async (resolve, reject) => {
        const status = await BarcodeScanner.checkPermission({force: true})
        if (status.granted) {
          resolve(true)
        } else if (status.denied) {
          const alert = await this.alertController.create({
            header: "pas de permissions pour la camera",
            message: "donnez accès au camera dans paramètre",
            buttons: [
              {
                text: "Non",
                role: 'cancel'
              },
              {
                text: "Ouvrir paramètre",
                handler: () => {
                  BarcodeScanner.openAppSettings();
                  resolve(false);
                }
              }
            ]

          })
        } else {
          resolve(false);
        }
      })
  }

  stopScanner() {
    this.scannActiv=false
    // @ts-ignore
    document.querySelector('body').classList.remove('scanner-active');
    //if (this.platform.is('capacitor')) {
    //this.offFlash();
    BarcodeScanner.stopScan();
    this.scannActiv = false;
    //}
  }
}
