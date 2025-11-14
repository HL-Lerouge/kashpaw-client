import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AlertController, ModalController} from "@ionic/angular";
import {Toast} from "@capacitor/toast";
import {ApiService} from "../../services/api.service";
import {ClientService} from "../../services/client.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-change-pin',
  templateUrl: './change-pin.component.html',
  styleUrls: ['./change-pin.component.scss'],
})
export class ChangePinComponent  implements OnInit {
  otp: string[] = ['', '', '', '', '', ''];
  
  constructor(private mdc:ModalController,private apiS:ApiService,private clsS:ClientService,
              private alertController:AlertController,private route:Router) {
    this.otpGenerer=this.genererCodeAleatoire()
  }

  dataUpdate={
    "telephone":"",
    "pin":"",
    "pin2":""
  }

  otpGenerer : any
  otpAntre : any
  telephone : any
  etap0=true;
  etap1=false
  etap2=false;
  genererCodeAleatoire() {
    return Math.floor(100000 + Math.random() * 900000);
  }
  onInput(index: number) {

    if (this.otp[index].length > 1) {

      this.otp[index] = this.otp[index].charAt(0);

    }

    this.otpAntre = this.otp.join('');

    if (this.otp[index].length === 1 && index < this.otp.length - 1) {

      const nextInput = document.getElementById(`otp-input-${index + 1}`);

      if (nextInput) {

        nextInput.focus();

      }

    }

  }


  onKeyDown(index: number, event: KeyboardEvent) {

    if (event.key === 'Backspace') {

      if (!this.otp[index] && index > 0) {

        const prevInput = document.getElementById(`otp-input-${index - 1}`);

        if (prevInput) {

          prevInput.focus();

        }

      }

    }

  }


  ngOnInit() {
    this.showPin();
  }

  showPin() {
    console.log("show pin")
    //this.ShowPin = !this.ShowPin;
  }
  cancel() {
    return this.mdc.dismiss(null, 'cancel');
  }

  confirm() {
    return this.mdc.dismiss("", 'confirm');
  }

  @Output() change: EventEmitter<string> = new EventEmitter<string>();

  pin:string= "";

  emitEvent() {
    this.change.emit(this.pin);
  }

  handleInput(pin: string) {
    if (pin === "clear") {
      this.pin = "";
      return;
    }

    if (this.pin.length === 4) {
      return;
    }
    this.pin += pin;
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
  

  validerOtp() {
    console.log(this.otpAntre)
    console.log(this.otpGenerer)
    if(this.otpAntre!=this.otpGenerer){
      this.showCustomToast("OTP invalide", "error")
      return;
    }
    this.etap2=true;
    this.etap1=false;
    this.etap0=false;
    this.dataUpdate.telephone=this.telephone;
  }

  envoyerOTP() {
    if(this.telephone.length<8){
      this.showCustomToast("No téléphone invalide", "error")
      return;
    }

    this.clsS.getCompteByNumber(this.telephone).then((R)=>{
      let message="Votre code de verification est "+this.otpGenerer
      message+="Ne le partagez pas. Si vous ne l'avez pas demandé ou si quelqu'un vous a appelé pour le demander, appelez-nous au " +
        "+50936750808"
      this.apiS.sendSMS(this.telephone,message).then((r)=>{
        this.showCustomToast("Envoyé avec succès", "success")
        this.etap0=false;
        this.etap1=true;
        this.etap2=false;
      })
    },(error)=>{
      this.showCustomToast("Ce numéro de compte n'existe pas", 'error');
    })
  }

  changerPassword() {
    this.clsS.changerPin(this.dataUpdate).then(async (r:any)=>{
      const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '',
      subHeader: '',
      message: 'Pin modifié avec succès',
      buttons: [
        {
          text: 'OK',
          cssClass: 'primary',
        }
      ],
    });
    await alert.present();
    await this.mdc.dismiss("","")
    },(error:any)=>{
      console.log(error)
      Toast.show({
        text:error.error.message
      })
    })
  }
}
