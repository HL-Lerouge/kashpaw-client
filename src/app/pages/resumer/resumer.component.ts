import {Component, OnInit} from '@angular/core';
import {Share} from "@capacitor/share";
import {Router} from "@angular/router";
import {ApiService} from "../../services/api.service";
import {InAppBrowser, InAppBrowserOptions} from "@ionic-native/in-app-browser/ngx";
import {AlertController, ModalController, Platform} from "@ionic/angular";
import {PaypalPaiementComponent} from "../paypal-paiement/paypal-paiement.component";
import {ClientService} from "../../services/client.service";
import {SingleTransactionComponent} from "../single-transaction/single-transaction.component";
import {Storage} from "@capacitor/storage";
import {AuthService} from "../../services/auth.service";
import { ZXingScannerComponent } from '@zxing/ngx-scanner';


@Component({
  selector: 'app-resumer',
  templateUrl: './resumer.component.html',
  styleUrls: ['./resumer.component.scss'],
})
export class ResumerComponent implements OnInit {

  qrvalue = ""
  valueSegement = "resumer"
  isModalRechargeOpen = false;
  isModalRechargeOpen1 = false;
  isModalHistoriqueOpen = false;
  divenvoyer = false;
  divMoncahDepot = false;
  divMoncashRetrait = false;
  divfacture = false;
  scannerEnabled = false;
  qrResult: string | null = null;

  availableDevices: MediaDeviceInfo[] = [];
  currentDevice: MediaDeviceInfo | null = null;
  
  info = {
    de: this.apiS.session()?.id,
    a: this.apiS.session()?.id,
    montant: 10,
  }

  infoPaiement = {
    paymentAmount: '0',
    currency: 'USD',
    currencyIcon: '$'
  }

  session: any;
  compte: any;
  recentsTransction: any

  interval: any

  constructor(private router: Router, private apiS: ApiService, private iab: InAppBrowser, private alertController: AlertController
    , private modalController: ModalController, private cliS: ClientService, private platform: Platform, private authS: AuthService) {
    /*platform.ready().then(() => {
      this.platform.pause.subscribe(async () => {
          this.interval = setInterval(async () => {
            const {value} = await Storage.get({key: 'temp_logout'});
            if (value == null) {
              await Storage.set({key: 'temp_logout', value: "1"});
            } else {
              let vl = parseInt(value) + 1
              await Storage.set({key: 'temp_logout', value: vl.toString()});
            }
            console.log(JSON.stringify(value));

          }, 1000)
      });

      this.platform.resume.subscribe(async () => {
        const {value} = await Storage.get({key: 'temp_logout'});
        if (value != null) {
          let vl = parseInt(value);
          if (vl >= 30) {
            await Storage.set({key: 'temp_logout', value: "0"});
            await this.router.navigateByUrl("home")
          } else {
            await Storage.set({key: 'temp_logout', value: "0"});
          }
        }
        clearInterval(this.interval)
      });

    });*/
    this.session = this.apiS.session();
  }

  ionViewWillEnter() {
    if(this.session){
      this.getCompte();
    }else{
      this.router.navigateByUrl("home")
    }
  }

  getCompte() {
    this.cliS.getCompte(this.session?.id).then(async (r: any) => {
      this.compte = r;
      this.recentsTransction = r?.recentTransaction.reverse()
      console.log(this.compte)
      this.qrvalue = this.compte.client.telephone.toString().replace("+509", "")
      console.log(this.qrvalue)
      /*await Toast.show({
        text: 'Success',
      });*/
    })
  }

  recentTransaction() {
    if(this.session) {
      this.cliS.historique(this.session?.id).then((response: any) => {
        this.recentsTransction = response.reverse();
      })
    }
  }

  ngOnInit() {
    this.qrvalue = "Valeur qr code"
    this.recentTransaction();
  }

  setOpenRecharge(isOpen: boolean) {
    this.isModalRechargeOpen = isOpen;
  }

  setOpenRecharge1(isOpen: boolean) {
    this.isModalRechargeOpen1 = isOpen;
  }

  async seg(value: string) {
    if (value == "inviter") {
      await Share.share({
        title: 'Télécharger KASH PAW',
        text: 'Really awesome app you need to see right now',
        url: 'https://hcash.com',
        dialogTitle: 'Share with buddies',
      });
      return
    }

    if (value == "resumer") {
      this.recentTransaction();
    }

    this.valueSegement = value
  }

  retirerArgent() {
    this.isModalRechargeOpen1 = true;
  }
  Facture() {
    this.divMoncashRetrait = true;
  }
  envoyerArgent() {
    this.router.navigateByUrl("principale/envoyer")
  }
  showBalance = false; // Par défaut, la valeur est cachée

  toggleBalance() {
    this.showBalance = !this.showBalance;
  }
  
  rechargerCompte() {
    this.isModalRechargeOpen = true;
  }

  goProfil() {
    this.router.navigateByUrl("profil")
  }

  annulerDepot() {
    this.divenvoyer = false;
    this.divMoncahDepot = false;
    this.divMoncashRetrait = false;
  }

  async depotPaypal() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Montant',
      inputs: [
        {
          name: 'montant',
          type: 'number',
          placeholder: 'montant',
          value: 10
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          }
        }, {
          text: 'Valider',
          cssClass: 'primary',
          handler: async (value) => {
            this.infoPaiement.paymentAmount = value?.montant
            const modal = await this.modalController.create({
              component: PaypalPaiementComponent,
              componentProps: {montant: value?.montant}
            })
            await modal.present();
          }
        }
      ]
    });
    await alert.present();
  }
  async depotNatcash() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Méthode en cours de développement',
      inputs: [
        {
          // name: 'montant',
          // type: 'number',
          // placeholder: 'montant',
          // value: 10
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          }
        }, 
      ]
    });
    await alert.present();
  }
  async depotMoncash() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Montant',
      inputs: [
        {
          name: 'montant',
          type: 'number',
          placeholder: 'montant',
          value: 25
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Valider',
          cssClass: 'primary',
          handler: async (value) => {
            this.info.montant = value?.montant;
            this.apiS.getLienMoncash(this.info).then(
              async (data: any) => {
                this.divenvoyer = false;
                this.divMoncahDepot = false;
                let options: InAppBrowserOptions = {
                  hidenavigationbuttons: 'yes',
                  hideurlbar: 'yes',
                  hardwareback: 'no',
                  zoom: 'no',
                  clearcache: 'yes',
                  closebuttoncaption: 'FERMER',
                  fullscreen: 'yes'
                }
                const browser = this.iab.create(data?.lien, "_self", options)
                browser.on('exit')?.subscribe((event) => {
                  this.getCompte();
                  this.recentTransaction()
                })
              }, (error) => {
                console.log(error);
              }
            )
          }
        }
      ]
    });
    await alert.present();
  }

  async retraitMonCash() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Retrait',
      inputs: [
        {
          name: 'numero',
          type: 'tel',
          placeholder: 'numero',
          value: this.apiS.session()?.telephone
        },
        {
          name: 'montant',
          type: 'number',
          placeholder: 'montant',
          value: 10
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: 'Valider',
          cssClass: 'primary',
          handler: async (value) => {
            this.info.montant = value?.montant;
            this.apiS.getLienMoncashTransfert(this.info).then(
              async (data: any) => {
                this.divenvoyer = false;
                this.divMoncahDepot = false;
                let options: InAppBrowserOptions = {
                  hidenavigationbuttons: 'yes',
                  hideurlbar: 'yes',
                  hardwareback: 'no',
                  zoom: 'no',
                  clearcache: 'yes',
                  closebuttoncaption: 'FERMER',
                  fullscreen: 'yes'
                }
                const browser = this.iab.create(data?.lien, "_self", options)
                browser.on('exit')?.subscribe((event) => {
                  this.getCompte();
                  this.recentTransaction()
                })
              }, (error) => {
                console.log(error);
              }
            )
          }
        }
      ]
    });
    await alert.present();
  }


  effectuerRetraitMoncash() {

  }

  async viewTransaction(t: any) {
    const modal = await this.modalController.create({
      component: SingleTransactionComponent,
      componentProps: {transactions: t}
    })
    await modal.present();
  }

  historiquesTransactions() {
    this.isModalHistoriqueOpen = true;
  }

  setOpenHistorique(isOpen: boolean) {
    this.isModalHistoriqueOpen = isOpen;
  }
    // Enable the scanner
    startScanner() {
      this.scannerEnabled = true;
    }
  
    // Handle scan success
    onScanSuccess(result: string) {
      this.qrResult = result;
      this.scannerEnabled = false; // Stop scanning after a successful scan
      //alert('Scanned data: ' + this.qrResult);
    }
  
    // Handle scan failure
    onScanFailure(error: any) {
      console.error('Scan failed:', error);
      alert('Scan failed. Please try again.');
    }
  
    // Handle camera device change
    onDeviceSelectChange(selectedValue: string) {
      const device = this.availableDevices.find((x) => x.deviceId === selectedValue);
      this.currentDevice = device || null;
    }
  
    // Handle cameras found
    onCamerasFound(devices: MediaDeviceInfo[]) {
      this.availableDevices = devices;
      if (devices.length > 0) {
        this.currentDevice = devices[0]; // Use the first available camera by default
      }
    }
  
    // Stop the scanner
    stopScanner() {
      this.scannerEnabled = false;
      this.currentDevice = null; // Reset the current device
      this.availableDevices = []; // Clear the list of available devices
    }
  
    // Toggle between cameras (if multiple cameras are available)
    switchCamera() {
      if (this.availableDevices.length > 1) {
        const currentIndex = this.availableDevices.findIndex(
          (device) => device.deviceId === this.currentDevice?.deviceId
        );
        const nextIndex = (currentIndex + 1) % this.availableDevices.length;
        this.currentDevice = this.availableDevices[nextIndex];
      }
    }
  
    // Initialize the scanner
    initializeScanner() {
      if (!this.scannerEnabled) {
        this.startScanner();
      }
    }
  
    // Clean up resources when the component is destroyed
    ngOnDestroy() {
      this.stopScanner();
    }
}
