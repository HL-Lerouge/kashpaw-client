import { Injectable } from '@angular/core';
//import {HttpClient} from "@angular/common/http";
import {LoadingController} from "@ionic/angular";
import {BASEURLAPI} from "../variable_global";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})


export class ClientService {
  get_frais(a: string) {
    throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient, private router: Router,private loading: LoadingController,private auth:AuthService) {
  }

  async getCompte(id: any) {
    // Retrieve the token from local storage
    const token = localStorage.getItem("token");
    // Check if the token exists
    if (!token) {
      return Promise.reject("No token found. User is not authenticated.");
    }
    // Set the headers with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    console.log(headers);
    return new Promise((resolve, reject) => {
      this.http.get(BASEURLAPI + 'get-compte', { headers }).subscribe(
        (data: any) => {
          resolve(data);
        },
        (error) => {
          if (error.status === 401) {
            // Handle unauthorized error (e.g., redirect to login page)
            console.error("Unauthorized. Redirecting to login...");
            this.router.navigateByUrl("/home");
          }
          reject(error);
        }
      );
    });
  }
  async getCompteByNumber(number:any) {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: ''
    });
    await loading.present();
    return new Promise(
      (resolve, reject) => {
        this.http.get(BASEURLAPI + 'get-compte-by-number?id=' + number).subscribe(
          (data: any) => {
            loading.dismiss();
            resolve(data);
          }, (error) => {
            loading.dismiss();
            reject(error);
          }
        );
      }
    );
  }
  async getfrais(amount:any) {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: ''
    });
    await loading.present();
    return new Promise(
      (resolve, reject) => {
        this.http.get(BASEURLAPI + 'get-frais?montant=' + amount).subscribe(
          (data: any) => {
            loading.dismiss();
            resolve(data);
          }, (error) => {
            loading.dismiss();
            reject(error);
          }
        );
      }
    );
  }

  async getVendeur(id:any) {
    return new Promise(
      (resolve, reject) => {
        this.http.get(BASEURLAPI + 'info-vendeur-' + id).subscribe(
          (data: any) => {
            resolve(data);
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }

  async transfert(info:any) {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: ''
    });
    const token = localStorage.getItem("token");
    // Check if the token exists
    if (!token) {
      return Promise.reject("No token found. User is not authenticated.");
    }
    // Set the headers with the token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    await loading.present();
    return new Promise(
      (resolve, reject) => {
        this.http.post(BASEURLAPI + 'transfert', info, { headers }).subscribe(
          (data: any) => {
            loading.dismiss();
              resolve(data); // Resolve the promise with the response
          }, (error) => {
            loading.dismiss();
            if (error.status === 401) {
              // Handle unauthorized error (e.g., redirect to login page)
              console.error("Unauthorized. Redirecting to login...");
              this.router.navigateByUrl("/home");
            }
            reject(error);
          }
        );
      }
    );
  }
  showCustomToast(arg0: string, arg1: string) {
    throw new Error('Method not implemented.');
  }

  async deleteCompte(info:any) {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: ''
    });
    await loading.present();
    return new Promise(
      (resolve, reject) => {
        this.http.post(BASEURLAPI + 'delete-compte', info).subscribe(
          (data: any) => {
            loading.dismiss();
            resolve(data);
          }, (error) => {
            loading.dismiss();
            reject(error);
          }
        );
      }
    );
  }

  async paiement(info:any) {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: ''
    });
    await loading.present();
    return new Promise(
      (resolve, reject) => {
        this.http.post(BASEURLAPI + 'paiement', info).subscribe(
          (data: any) => {
            loading.dismiss();
            resolve(data);
          }, (error) => {
            loading.dismiss();
            reject(error);
          }
        );
      }
    );
  }


  async depot(info:any) {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: ''
    });
    await loading.present();
    return new Promise(
      (resolve, reject) => {
        this.http.post(BASEURLAPI + 'depot-client', info).subscribe(
          (data: any) => {
            loading.dismiss();
            resolve(data);
          }, (error) => {
            loading.dismiss();
            reject(error);
          }
        );
      }
    );
  }

  async changerPin(info:any) {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: ''
    });
    await loading.present();
    return new Promise(
      (resolve, reject) => {
        this.http.post(BASEURLAPI + 'changer-pin', info).subscribe(
          (data: any) => {
            loading.dismiss();
            resolve(data);
          }, (error) => {
            loading.dismiss();
            reject(error);
          }
        );
      }
    );
  }

  async historique(id_client:any) {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: ''
    });
    await loading.present();
    return new Promise(
      (resolve, reject) => {
        this.http.get(BASEURLAPI + 'historique-transaction-'+id_client).subscribe(
          (data: any) => {
            loading.dismiss();
            resolve(data);
          }, (error) => {
            loading.dismiss();
            reject(error);
          }
        );
      }
    );
  }

  async transfertBalanceCredit(info:any) {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: ''
    });
    await loading.present();
    return new Promise(
      (resolve, reject) => {
        this.http.post(BASEURLAPI + 'transfert-balance-credit', info).subscribe(
          (data: any) => {
            loading.dismiss();
            resolve(data);
          }, (error) => {
            loading.dismiss();
            reject(error);
          }
        );
      }
    );
  }

  async transfertVendeur(info:any) {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: ''
    });
    await loading.present();
    return new Promise(
      (resolve, reject) => {
        this.http.post(BASEURLAPI + 'transfert-vendeur', info).subscribe(
          (data: any) => {
            loading.dismiss();
            resolve(data);
          }, (error) => {
            loading.dismiss();
            reject(error);
          }
        );
      }
    );
  }
  async transfertVendeurV(info:any) {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: ''
    });
    await loading.present();
    return new Promise(
      (resolve, reject) => {
        this.http.post(BASEURLAPI + 'transfert-vendeur-client', info).subscribe(
          (data: any) => {
            loading.dismiss();
            resolve(data);
          }, (error) => {
            loading.dismiss();
            reject(error);
          }
        );
      }
    );
  }

  async historiqueVendeur(id_client:any) {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: ''
    });
    await loading.present();
    return new Promise(
      (resolve, reject) => {
        this.http.get(BASEURLAPI + 'historique-transaction-vendeur-'+id_client).subscribe(
          (data: any) => {
            loading.dismiss();
            resolve(data);
          }, (error) => {
            loading.dismiss();
            reject(error);
          }
        );
      }
    );
  }

  async historiqueNoLoad(id_client:any) {
    return new Promise(
      (resolve, reject) => {
        this.http.get(BASEURLAPI+ 'historique-transaction-'+id_client).subscribe(
          (data: any) => {
            resolve(data);
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }
  async historiqueVendeurNoLoad(id_client:any) {
    return new Promise(
      (resolve, reject) => {
        this.http.get(BASEURLAPI + 'historique-transaction-vendeur-'+id_client).subscribe(
          (data: any) => {
            resolve(data);
          }, (error) => {
            reject(error);
          }
        );
      }
    );
  }

  async sendSms(info:any) {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: ''
    });
    await loading.present();
    return new Promise(
      (resolve, reject) => {
        this.http.post(BASEURLAPI + 'send-sms', info).subscribe(
          (data: any) => {
            loading.dismiss();
            resolve(data);
          }, (error) => {
            loading.dismiss();
            reject(error);
          }
        );
      }
    );
  }

  async rapportVendeur(id_client:any,debut:any,fin:any) {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: ''
    });
    await loading.present();
    return new Promise(
      (resolve, reject) => {
        this.http.get(BASEURLAPI + 'rapport-vendeur-cash-'+id_client+'?debut='+debut+'&fin='+fin).subscribe(
          (data: any) => {
            loading.dismiss();
            resolve(data);
          }, (error) => {
            loading.dismiss();
            reject(error);
          }
        );
      }
    );
  }
}
