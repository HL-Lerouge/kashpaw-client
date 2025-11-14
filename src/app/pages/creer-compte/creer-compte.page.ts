import {Component, enableProdMode, OnInit} from '@angular/core';
import {Toast} from "@capacitor/toast";
import {ApiService} from "../../services/api.service";
import {AlertController} from "@ionic/angular";
import {Router} from "@angular/router";
import {Device} from "@capacitor/device";
import {DEPARTEMENT, PAYS} from "../../variable_global";
import {PhotoService} from "../../services/photo.service";
import {Camera, CameraDirection, CameraResultType, CameraSource} from "@capacitor/camera";
import {defineCustomElements} from '@ionic/pwa-elements/loader';
import {environment} from "../../../environments/environment";
import {MaskitoElementPredicate, MaskitoOptions, maskitoTransform} from "@maskito/core";
import {AuthService} from "../../services/auth.service";
import {ClientService} from "../../services/client.service";

defineCustomElements(window);
if (environment.production) {
  enableProdMode();
}

@Component({
  selector: 'app-creer-compte',
  templateUrl: './creer-compte.page.html',
  styleUrls: ['./creer-compte.page.scss'],
})
export class CreerComptePage implements OnInit {
  
  maxDateNaisance="2000-01-01";
  departements=DEPARTEMENT;
  villes : any = []
  //fileToUpload: File [];

  dataImage: UserPhoto[] = []

  dataRegistration = {
    nom: "",
    prenom: "",
    telephone: "",
    date_naissance: "",
    sexe: "masculin",
    type_piece: "",
    no_piece: "",
    pin: "",
    pin2: "",
    device_id: "",
    dial_code: "+509",
    pays_name: "",
    code_postal: "",
    ville: "",
    departement: "",
    nom_mere: "",
    ref_code: "",
    selfi: "",
    piece: "",
    preuve: ""
  }

  pays = "Haiti-+509"
  listePays = PAYS

  placeHolderNoPiece : any

  etap0=true;
  etapOtp=false;

  etap1=false;
  etap2 = false;
  etap3 = false;

  otpGenerer : any
  otpAntre: any 
  telephone : any

  click_foto = true
  click_foto1 = true
  click_foto2 = true
  div_info = true
  div_selfi = false
  div_piece_identite = false
  div_preuve_addresse = false
  div_resume = false;

  genererCodeAleatoire() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  deconnecter() {
    localStorage.clear();
    this.router.navigateByUrl("home")
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

  envoyerOTP() {
    if(this.telephone.length<8){
      this.showCustomToast("No téléphone invalide", "error")
      return;
    }

    this.clientS.getCompteByNumber(this.telephone).then((R)=>{
      this.showCustomToast("No téléphone existe deja ", "error")
    },(error)=>{
      let message="Votre code de verification est "+this.otpGenerer
      message+=" ne le partagez pas. si vous ne l'avez pas demande ou si on vous a appele pour le demmander," +
        "appele nous au ....."

      this.apiS.sendSMS(this.telephone,message).then((r)=>{
        this.showCustomToast("Envoyé avec succès", "success")
        this.etap0=false;
        this.etapOtp=true;
      })
    })
  }

  backToEnvoyerOTP() {
    this.etap0=true;
    this.etapOtp=false;
  }

  validerOtp() {
    if(this.otpAntre!=this.otpGenerer){
      Toast.show({
        text:""
      })
      this.showCustomToast("OTP invalide", "error")
      return
    }
    this.dataRegistration.telephone=this.telephone
    this.etapOtp=false;
    this.etap0=false;
    this.otpGenerer=false;
    this.etap1=true
    this.div_info=true;
  }

  backToValiderOtp() {
    this.etap0=false;
    this.otpGenerer=false;
    this.etap1=false
    this.div_info=false;
    this.etapOtp = true;
  }

  constructor(
    private apiS: ApiService, private alertController: AlertController, private router: Router, public photoService: PhotoService
  ,private clientS:ClientService) {
    this.otpGenerer=this.genererCodeAleatoire();
  }

  ngOnInit() {
    const today = new Date();
    const year = today.getFullYear() - 18; // Calculer l'année maximum
    const month = ('0' + (today.getMonth() + 1)).slice(-2); // Ajouter un zéro pour les mois < 10
    const day = ('0' + today.getDate()).slice(-2); // Ajouter un zéro pour les jours < 10
    this.maxDateNaisance= `${year}-${month}-${day}`;
    Device.getId().then(r => {
      this.dataRegistration.device_id = r.identifier
      console.log(this.dataRegistration.device_id)
    })
  }

  paysChange(event: any) {
    this.dataRegistration.dial_code = event.detail.value.toString().split("-")[1]
  }

  creerCompte() {

    if (this.dataRegistration.nom == "") {
      Toast.show({
        text: "Nom incorrect",
        duration: "long",
        position: "center"
      })
      return;
    } else if (this.dataRegistration.prenom == "") {
      Toast.show({
        text: "Nom incorrect",
        duration: "long",
        position: "center"
      })
      return;
    } else if (this.dataRegistration.telephone == "") {
      Toast.show({
        text: "Prénom incorrect",
        duration: "long",
        position: "center"
      })
      return;
    } else if (this.dataRegistration.date_naissance == "") {
      Toast.show({
        text: "Date naissance incorrect",
        duration: "long",
        position: "center"
      })
      return;
    } else if (this.dataRegistration.type_piece == "") {
      Toast.show({
        text: "Type piece incorrect",
        duration: "long",
        position: "center"
      })
      return;
    } else if (this.dataRegistration.no_piece == "") {
      Toast.show({
        text: "No piece incorrect",
        duration: "long",
        position: "center"
      })
      return
    } else if (this.dataRegistration.pin == "") {
      Toast.show({
        text: "Pin incorrect",
        duration: "long",
        position: "center"
      })
      return
    } else if (this.dataRegistration.pin2 == "") {
      Toast.show({
        text: "Pin incorrect",
        duration: "long",
        position: "center"
      })
      return
    } else if (this.dataRegistration.pin != this.dataRegistration.pin2) {
      Toast.show({
        text: "PIN doit être identique",
        duration: "long",
        position: "center"
      })
      return;
    }

    this.apiS.registration(this.formData).then(async (r) => {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: '',
        subHeader: '',
        message: 'Compte creé avec succès',
        buttons: [
          {
            text: 'OK',
            cssClass: 'primary',
          }
        ],
      });
      await alert.present();

      this.dataRegistration = {
        nom: "",
        prenom: "",
        telephone: "",
        date_naissance: "",
        sexe: "",
        type_piece: "",
        no_piece: "",
        pin: "",
        pin2: "",
        device_id: "",
        dial_code: "+509",
        pays_name: "",
        code_postal: "",
        ville: "",
        departement: "",
        nom_mere: "",
        ref_code:"",
        selfi: "",
        piece: "",
        preuve: ""
      }

      this.router.navigateByUrl("/home").then(r => {
      })

    }, (error) => {
      console.log(error)
    })
  }
  
  suivant() {

    if(this.dataRegistration.type_piece=="lisans"){
      if(this.dataRegistration.no_piece.length<10){
        Toast.show({
          text:"Nif incorrect"
        })
        return ;
      }
    }

    if (this.dataRegistration.nom == "") {
      Toast.show({
        text: "svp veuillez remplir tout les champs",
        duration: "long",
        position: "center"
      })
      return;
    } else if (this.dataRegistration.prenom == "") {
      Toast.show({
        text: "svp veuillez remplir tout les champs",
        duration: "long",
        position: "center"
      })
      return;
    } else if (this.dataRegistration.date_naissance == "") {
      Toast.show({
        text: "svp veuillez remplir tout les champs",
        duration: "long",
        position: "center"
      })
      return;
    }else if (this.dataRegistration.sexe == "") {
      Toast.show({
        text: "svp veuillez remplir tout les champs",
        duration: "long",
        position: "center"
      })
      return;
    }else if (this.dataRegistration.departement == "") {
      Toast.show({
        text: "svp veuillez remplir tout les champs",
        duration: "long",
        position: "center"
      })
      return;
    }
    else if (this.dataRegistration.ville == "") {
      Toast.show({
        text: "svp veuillez remplir tout les champs",
        duration: "long",
        position: "center"
      })
      return;
    }
    else if (this.dataRegistration.code_postal == "") {
      Toast.show({
        text: "svp veuillez remplir tout les champs",
        duration: "long",
        position: "center"
      })
      return;
    }
    else if (this.dataRegistration.type_piece == "") {
      Toast.show({
        text: "svp veuillez remplir tout les champs",
        duration: "long",
        position: "center"
      })
      return;
    } else if (this.dataRegistration.no_piece == "") {
      Toast.show({
        text: "svp veuillez remplir tout les champs",
        duration: "long",
        position: "center"
      })
      return
    }else if (this.dataRegistration.nom_mere == "") {
      Toast.show({
        text: "svp veuillez remplir tout les champs",
        duration: "long",
        position: "center"
      })
      return
    }
    else if (this.dataRegistration.pin == "") {
      Toast.show({
        text: "svp veuillez remplir tout les champs",
        duration: "long",
        position: "center"
      })
      return
    } else if (this.dataRegistration.pin2 == "") {
      Toast.show({
        text: "svp veuillez remplir tout les champs",
        duration: "long",
        position: "center"
      })
      return
    } else if (this.dataRegistration.pin != this.dataRegistration.pin2) {
      Toast.show({
        text: "PIN doit être identique",
        duration: "long",
        position: "center"
      })
      return;
    }
    this.etap1 = false;
    this.div_info = false;
    this.etap2 = true;
    this.div_selfi = true;
    this.click_foto = true;
  }

  suivant2() {
    this.div_info = false;
    this.div_selfi = false;
    this.div_piece_identite = true;
    this.click_foto = false;
    this.click_foto1 = true;
  }

  back2() {
    this.div_info = true;
    this.div_selfi = false;
    this.div_piece_identite = false;
    this.click_foto = false;
    this.click_foto1 = true;
  }

  suivant3() {
    this.div_info = false;
    this.div_selfi = false;
    this.div_piece_identite = false;
    this.div_preuve_addresse = true;
    this.click_foto1 = false;
    this.click_foto2 = true;
  }
  back3() {
    this.div_info = false;
    this.div_selfi = true;
    this.div_piece_identite = false;
    this.div_preuve_addresse = false;
    this.click_foto1 = false;
    this.click_foto2 = true;
  }


  formData = new FormData();

  back4() {
    this.etap1 = true;
    this.div_info = true;
    this.etap2 = false;
    this.div_selfi = false;
    this.div_piece_identite = false;
    this.div_preuve_addresse = false;
    this.div_resume = false;
  }
  back5() {
    this.etap2 = true;
    this.div_selfi = true;
    this.div_piece_identite = false;
    this.div_preuve_addresse = false;
    this.div_resume = false;
    this.etap3 = false;
  }

  backToIdentity() {
    this.div_info = false;
    this.div_selfi = true;
    this.div_resume = false;
  }

  suivant4() {
    this.dataImage.unshift(this.photoService.photos[0])
    this.dataImage.unshift(this.photoService.photos[1])
    this.dataImage.unshift(this.photoService.photos[2])
    this.div_info = false;
    this.div_selfi = false;
    this.div_piece_identite = false;
    this.div_preuve_addresse = false;
    this.etap2 = false;
    this.etap3 = true;
    this.div_resume = true;
    this.formData.append("nom", this.dataRegistration.nom)
    this.formData.append("prenom", this.dataRegistration.prenom)
    this.formData.append("telephone", this.dataRegistration.telephone)
    this.formData.append("date_naissance", this.dataRegistration.date_naissance)
    this.formData.append("sexe", this.dataRegistration.sexe)
    this.formData.append("type_piece", this.dataRegistration.type_piece)
    this.formData.append("no_piece", this.dataRegistration.no_piece)
    this.formData.append("pin", this.dataRegistration.pin)
    this.formData.append("pin2", this.dataRegistration.pin2)
    this.formData.append("device_id", this.dataRegistration.device_id)
    this.formData.append("dial_code", this.dataRegistration.dial_code)
    this.formData.append("pays_name", this.dataRegistration.pays_name)
    this.formData.append("code_postal", this.dataRegistration.code_postal)
    this.formData.append("ville", this.dataRegistration.ville)
    this.formData.append("departement", this.dataRegistration.departement)
    this.formData.append("nom_mere", this.dataRegistration.nom_mere)
    this.formData.append("ref_code", this.dataRegistration.ref_code)
    let blob_selfi = this.photoService.convertBase64ToBlob(this.photoService.base64ToImage(this.selfibase64).src);
    let blob_piece = this.photoService.convertBase64ToBlob(this.photoService.base64ToImage(this.piecebase64).src);
    let blob_preuve = this.photoService.convertBase64ToBlob(this.photoService.base64ToImage(this.preuvebase64).src);
    this.formData.append("fichier[]", blob_selfi, "selfi.png")
    this.formData.append("fichier[]", blob_piece, "piece.png")
    this.formData.append("fichier[]", blob_preuve, "preuve.png")
  }

  addPhotoToGallery() {
    this.photoService.addNewToGallery();

    if (this.click_foto) {
      this.click_foto = false;
    }

    if (this.click_foto1) {
      this.click_foto1 = false;
    }

    if (this.click_foto2) {
      this.click_foto2 = false;
    }

  }

  selfibase64: any = "";
  piecebase64: any = "";
  preuvebase64: any = "";

  addSelfi() {
    Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      direction:CameraDirection.Front,
      quality: 100,
    }).then((r) => {
      this.selfibase64 = r.base64String
    });
    if (this.click_foto) {
      this.click_foto = false;
    }

    if (this.click_foto1) {
      this.click_foto1 = false;
    }

    if (this.click_foto2) {
      this.click_foto2 = false;
    }
  }

  addPiece() {
    Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      direction:CameraDirection.Rear,
      quality: 100,
    }).then((r) => {
      this.piecebase64 = r.base64String
    });
    if (this.click_foto) {
      this.click_foto = false;
    }

    if (this.click_foto1) {
      this.click_foto1 = false;
    }

    if (this.click_foto2) {
      this.click_foto2 = false;
    }
  }

  addPreuve() {
    Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      direction:CameraDirection.Rear,
      quality: 100,
    }).then((r) => {
      this.preuvebase64 = r.base64String
    });
    if (this.click_foto) {
      this.click_foto = false;
    }

    if (this.click_foto1) {
      this.click_foto1 = false;
    }

    if (this.click_foto2) {
      this.click_foto2 = false;
    }
  }


  departementChange($event: any) {
    let value = $event.detail.value
    let d = this.departements.find((s)=>{
      return s.nom.trim()===value.trim()
    })
    this.villes=d.communes
    this.dataRegistration.code_postal=d.code_postal
    console.log(d)
  }

  back() {
    history.back()
  }

  pieceMask : MaskitoOptions ={mask: []}
  type="number"
  inputmode="text"

  typePieceChange(event:any){
    this.dataRegistration.no_piece=""
    let v=event.detail.value;
    if(v==="lisans"){
      this.inputmode="numeric"
      this.type="text"
      this.placeHolderNoPiece="000-000-000-0"
      this.pieceMask = {
        mask: [/\d/, /\d/, /\d/, '-',/\d/, /\d/, /\d/,'-',/\d/, /\d/, /\d/,'-',/\d/],
      };
    }

    if(v==="kat_identifikasyon_nasyonal"){
      this.inputmode="numeric"
      this.type="text"
      this.placeHolderNoPiece="0000000000"
      this.pieceMask = {
        mask: [/\d/, /\d/, /\d/,/\d/, /\d/, /\d/,/\d/, /\d/, /\d/,/\d/],
      };
    }

    if(v==="paspo"){
      this.type="text"
      this.inputmode=""
      this.placeHolderNoPiece="PP0987384"
      this.pieceMask = {
        mask: [/\d/, /\d/, /\d/,/\d/, /\d/, /\d/,/\d/, /\d/, /\d/],
      };
    }
  }

  readonly maskPredicate: MaskitoElementPredicate = async (el) => (el as HTMLIonInputElement).getInputElement();

}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
  base64?: string;
}

