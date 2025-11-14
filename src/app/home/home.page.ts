import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, Platform } from "@ionic/angular";
import { ApiService } from "../services/api.service";
import { AuthService } from '../services/auth.service'; // Adjust the path as needed
import { Router } from "@angular/router";
import { PAYS } from "../variable_global";
import { PaypalPaiementComponent } from "../pages/paypal-paiement/paypal-paiement.component";
import { ChangePinComponent } from "../pages/change-pin/change-pin.component";
import { Storage } from "@capacitor/storage";
import { BackButtonEvent } from "@ionic/core";
import { App } from "@capacitor/app";
import { ChangeDetectorRef } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('loginButton', { static: false }) loginButton!: ElementRef;
  showOtpInput: boolean = false;
  otp: string[] = ['', '', '', ''];
  dataLogin = {
    telephone: "",
    pin: "",
    device_id: "", // Will be populated with device info
    otp: "",
    dial_code: "+509"
  };

  pays = "Haiti-+509";
  listePays = PAYS;

  toggleOtpInput() {
    this.showOtpInput = !this.showOtpInput;
    this.cdr.detectChanges(); // Force UI update
  }
  constructor(
    private alertController: AlertController,
    private apiS: ApiService,
    private router: Router,
    private modalController: ModalController,
    private platform: Platform,
    private authService: AuthService, // Inject AuthService
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    // Fetch device info and assign it to dataLogin.device_id
    const deviceInfo = await this.authService.getDynamicDeviceInfo();
    this.dataLogin.device_id = JSON.stringify(deviceInfo); // Convert to string for storage
  }

  async ionViewDidEnter() {
    const routerEl = document.querySelector('ion-router');
    // @ts-ignore
    document.addEventListener('ionBackButton', (ev: BackButtonEvent) => {
      ev.detail.register(-1, () => {
        const path = window.location.pathname;
        if (path.includes("home")) {
          localStorage.clear();
          App.exitApp();
        }
      });
    });
  }

  async pinoublier() {
    const modal = await this.modalController.create({
      component: ChangePinComponent,
    });
    await modal.present();
  }

  onInput(index: number) {
    if (this.otp[index].length > 1) {
      this.otp[index] = this.otp[index].charAt(0);
    }

    this.dataLogin.pin = this.otp.join('');

    if (this.otp[index].length === 1 && index < this.otp.length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  onKeyDown(index: number, event: KeyboardEvent) {
    // Handle backspace to move back to the previous input
    if (event.key === 'Backspace') {
      if (!this.otp[index] && index > 0) {
        const prevInput = document.getElementById(`otp-input-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
        }
      }
    }
  }

  async connecter() {
    // Ensure device info is fetched before making the login request
    if (!this.dataLogin.device_id) {
      const deviceInfo = await this.authService.getDynamicDeviceInfo();
      this.dataLogin.device_id = JSON.stringify(deviceInfo);
    }
    this.apiS.login(this.dataLogin).then(
      (r: any) => {
        // Type assertion
        const response = r as { token: string; user: any; statut: string; etat: string };

        // Store the token and session data
        localStorage.setItem("token", response.token);
        localStorage.setItem("session", JSON.stringify(response.user));
        localStorage.setItem("connect", "oui");
        localStorage.setItem("etat", response.etat);
        this.showOtpInput = false; // Show OTP input on 401 error

        // Navigate to the home page
        this.router.navigateByUrl("/principale").then(() => { });
      },
      async (error) => {
        console.log(error);
        if (error?.error?.code == 401) {
          this.showOtpInput = true; // Show OTP input on 401 error
          this.cdr.detectChanges(); // Force change detection
          console.log('showOtpInput after 401 error:', this.showOtpInput); // Should be true
        }

        const alert = await this.alertController.create({
          header: '',
          subHeader: '',
          message: error?.error?.message,
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }
}