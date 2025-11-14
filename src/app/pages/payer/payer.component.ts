import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ClientService } from '../../services/client.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-payer',
  templateUrl: './payer.component.html',
  styleUrls: ['./payer.component.scss'],
})
export class PayerComponent implements OnInit {
  etap = '1'; // Current step in the process
  numero_a = ''; // Merchant number (if entered manually)
  montant_a = 0; // Amount to send
  frais_transaction = 0; // Transaction fee

  // Transaction details
  infoTransfert = {
    no_transaction: '',
    de: '',
    a: '',
    montant: 0,
    frais: 0,
    total_transaction: '',
    marchand: '',
  };

  dataQrcode: any; // Scanned QR code data
  scannActiv = false; // Scanner state
  comptePrincipale: any; // Account details
  session: any; // User session
  currentDevice: MediaDeviceInfo | undefined; // Current camera device
  availableDevices: MediaDeviceInfo[] = []; // List of available cameras

  constructor(
    private router: Router,
    private alertController: AlertController,
    private cliS: ClientService,
    private authS: AuthService
  ) {}

  ngOnInit() {
    this.etap = '1'; // Start at step 1
    this.frais_transaction = this.authS.session()?.frais_transaction?.paiement; // Get transaction fee
    this.session = localStorage.getItem('session');
    this.session = JSON.parse(this.session); // Parse session data
    this.startScanner(); // Initialize the scanner
  }

  // Initialize the scanner
  startScanner() {
    this.scannActiv = true; // Activate the scanner
  }

  // Handle scan success
  onScanSuccess(scannedText: string) {
    this.scannActiv = false; // Stop scanning
    this.etap = '2'; // Move to step 2 (transaction details)
    this.dataQrcode = JSON.parse(scannedText); // Parse the scanned QR code data
    this.infoTransfert.marchand = this.dataQrcode.nom; // Set merchant name
    this.infoTransfert.a = this.dataQrcode.marchand; // Set merchant number
    this.infoTransfert.montant = this.dataQrcode.montant; // Set transaction amount
    this.infoTransfert.frais = 0;
    this.montant_a = this.dataQrcode.montant;// Calculate fees
    this.infoTransfert.total_transaction = this.dataQrcode.montant; // Calculate total
    this.infoTransfert.no_transaction = this.dataQrcode.id_transaction; // Set transaction ID
    console.log(this.infoTransfert); // Log transaction details
    this.getCompte(); // Fetch account details
  }
  
  // Handle scan error
  onScanError(error: any) {
    console.error('Scan error:', error); // Log the error
    alert('Scan failed. Please try again.'); // Notify the user
  }
  switchCamera() {
    if (this.availableDevices.length > 1) {
      const currentIndex = this.availableDevices.findIndex(
        device => device.deviceId === this.currentDevice?.deviceId
      );
      const nextIndex = (currentIndex + 1) % this.availableDevices.length;
      this.currentDevice = this.availableDevices[nextIndex];
    }
  }
  // Handle cameras found
  onCamerasFound(devices: MediaDeviceInfo[]) {
    this.availableDevices = devices;
  
    // Find and use the rear camera by default
    const rearCamera = devices.find(device => 
      device.label.toLowerCase().includes('back') || 
      device.label.toLowerCase().includes('rear') ||
      device.label.toLowerCase().includes('main')
    );
    
    // Use rear camera if found, otherwise use first available device
    this.currentDevice = rearCamera || devices[0];
    
    // Remove the camera switch button by not implementing switchCamera()
  }

  // Stop the scanner
  stopScanner() {
    this.scannActiv = false; // Deactivate the scanner
  }

  // Get account details
  getCompte() {
    this.cliS.getCompte(this.session?.id).then(
      (res: any) => {
        this.comptePrincipale = res; // Set account details
        this.infoTransfert.de = res?.id_client; // Set sender ID
      },
      (error: any) => {
        console.error(error); // Log the error
      }
    );
  }

  // Handle manual merchant number input
  async insereNum() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      inputs: [
        {
          name: 'numero_marchand',
          type: 'number',
          placeholder: 'Numéro marchand',
        },
        {
          name: 'montant',
          type: 'number',
          placeholder: 'Montant',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: this.capitalizeFirstLetter('Continuer'),
          cssClass: 'primary',
          handler: () => {
            console.log('Confirm Ok');
            this.etap = '2'; // Move to step 2
            this.getCompte(); // Fetch account details
          },
        },
      ],
    });

    await alert.present(); // Show the alert
  }

  // Capitalize the first letter of a string
  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  // Proceed to step 3 (transaction summary)
  suivant2() {
    this.infoTransfert.montant = this.montant_a; // Set transaction amount
    this.etap = '3'; // Move to step 3
  }

  // Confirm the transaction
  async confirmer() {
    this.cliS.paiement(this.infoTransfert).then(
      async (response: any) => {
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Succès',
          subHeader: '',
          message: 'Paiement effectué avec succès',
          buttons: [
            {
              text: 'OK',
              cssClass: 'primary',
            },
          ],
        });
        await alert.present(); // Show success message
        await this.router.navigateByUrl('principale/resumer'); // Navigate to the home page
      },
      async (error: any) => {
        console.error(error); // Log the error
        alert(error.error?.message); // Notify the user
      }
    );
  }
}