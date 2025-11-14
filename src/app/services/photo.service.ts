import { Injectable } from '@angular/core';
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: UserPhoto[] = [];
  constructor() {

  }

  base64ToImage(base64String:any) {
    const img = new Image();
    img.src = "data:image/png;base64," + base64String;
    return img;
  }

  public getInfoFromBase64(base64: string) {
    const meta = base64.split(',')[0];
    const rawBase64 = base64.split(',')[1].replace(/\s/g, '');
    // @ts-ignore
    const mime = /:([^;]+);/.exec(meta)[1];
    // @ts-ignore
    const extension = /\/([^;]+);/.exec(meta)[1];

    return {
      mime,
      extension,
      meta,
      rawBase64
    };
  }

  public convertBase64ToBlob(base64: string) {
    const info = this.getInfoFromBase64(base64);
    const sliceSize = 512;
    const byteCharacters = window.atob(info.rawBase64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: info.mime });
  }

  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 100,
    });

    this.photos.unshift({
      filepath: "soon...",
      webviewPath:this.base64ToImage(capturedPhoto.base64String).src,
      base64:capturedPhoto.base64String!
    });
  }
}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
  base64?: string;
}
