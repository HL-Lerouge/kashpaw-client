import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { LoadingController } from "@ionic/angular";
import { BASEURLAPI } from "../variable_global";
import { Capacitor } from '@capacitor/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private loading: LoadingController) {
  }

  async getLienMoncashy(data: any) {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: ''
    });
    await loading.present();

    // Extract only the `montant` from the `data` object
    const { montant } = data;

    // Create a new object with only the required fields
    const requestData = {
      montant: montant,
      client: 146,
      payment_method:'moncash',
      refference_id: randomUUID(),
      //client_id: 'pp_8xbbqhsob0y',
    };

    return new Promise((resolve, reject) => {
      this.http.post('https://plopplop.solutionip.app/api/paiement-marchand', requestData).subscribe(
        (response: any) => {
          loading.dismiss();
          // Check if response contains redirect
          if (response.body?.url) {
            console.log(response);
            window.location.href = response.body.url;
            
          } else if (response.status === 302 || response.status === 301) {
            const redirectUrl = response.headers.get('Location');
            if (redirectUrl) {
              window.location.href = redirectUrl;
            } else {
              reject({ message: "Redirect URL not found" });
            }
          } else {
            resolve(response.body);
           
          }

        },
        (error) => {
          loading.dismiss();
          reject(error);
        }
      );
    });
  }

  async getLienMoncash(data: any) {
    const loading = await this.loading.create({ message: 'Processing payment...' });
    await loading.present();
    const client = this.session();
    const refference_id = this.getRandomNumber(100000, 100000000000000);
    const requestData = {
      montant: data.montant,
      client: client.id,
      payment_method:'moncash',
      refference_id: refference_id, // Ensure client ID is present
      client_id: 'pp_8xbbqhsob0y',
    };
  
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    try {
      // Make the HTTP POST request
      const response: any = await this.http.post(
        'https://plopplop.solutionip.app/api/paiement-marchand',
        requestData,
        { headers, responseType: 'text' } // Use 'text' to handle non-JSON responses
      ).toPromise();
  
      loading.dismiss();
  
      // Extract the JSON part from the response
      const jsonStart = response.indexOf('{');
      const jsonEnd = response.lastIndexOf('}');
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('Invalid server response: No JSON data found');
      }
  
      const jsonResponse = JSON.parse(response.substring(jsonStart, jsonEnd + 1));
  
      // Check if the response contains a valid redirect URL
      if (jsonResponse.status && jsonResponse.url) {
        // Use InAppBrowser for mobile apps or window.open for browsers
        // if (this.platform.is('cordova') {
        //   const browser = this.iab.create(jsonResponse.url_paiement, '_system');
        //   browser.show();
        // } else {
          window.open(jsonResponse.url);
       // }
      } else {
        console.error('Payment failed:', jsonResponse.message);
      }
    } catch (error) {
      loading.dismiss();
      console.error('Error during payment request:', error);
    }
  }
  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  async getLienMoncashTransfert(data: any) {
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: ''
    });
    await loading.present();
    return new Promise(
      (resolve, reject) => {
        this.http.post(BASEURLAPI + 'redirect-moncash-transfert', data).subscribe(
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

  session() {
    if (localStorage.getItem('session')) {
      // @ts-ignore
      return JSON.parse(localStorage.getItem("session"));
    }
  }

  async login(dataLogin: any) {
    const loading = await this.loading.create({
      cssClass: '',
      message: 'Patientez...'
    });
    await loading.present();

    return new Promise(
      (resolve, reject) => {
        this.http.post(BASEURLAPI + "login", dataLogin).subscribe(
          (data: any) => {
            loading.dismiss()
            resolve(data);
          }, (error) => {
            loading.dismiss()
            reject(error);
          }
        );
      }
    );
  }

  async registration(dataRegistration: any) {
    const loading = await this.loading.create({
      cssClass: '',
      message: 'Patientez...'
    });
    await loading.present();

    return new Promise(
      (resolve, reject) => {
        this.http.post(BASEURLAPI + "registration", dataRegistration).subscribe(
          (data: any) => {
            loading.dismiss()
            resolve(data);
          }, (error) => {
            loading.dismiss()
            reject(error);
          }
        );
      }
    );
  }

  async sendSMS(telephone: any, message: any) {
    //let lien=BASEURLAPI + "send-sms?telephone=509"+telephone+"&message="+message+""
    let lien = "https://textify.solutionip.app/api/v1/send?number=509" + telephone + "&message=" + message + ""
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: ''
    });
    await loading.present();
    return new Promise(
      (resolve, reject) => {
        this.http.get(lien).subscribe(
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

  /*async sendSMS(telephone:any,message:any){
    let lien=BASEURLAPI + "send-sms?telephone=509"+telephone+"&message="+message+""
    //let lien="https://textify.solutionip.app/api/v1/send?number="+telephone+"&message="+message+""
    const loading = await this.loading.create({
      cssClass: 'my-custom-class',
      message: ''
    });
    await loading.present();
    return new Promise(
      (resolve, reject) => {
        this.http.get(lien).subscribe(
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
  }*/

}
function randomUUID() {
  throw new Error('Function not implemented.');
}

