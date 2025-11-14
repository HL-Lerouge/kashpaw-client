import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { LoadingController } from "@ionic/angular";
import { Router } from "@angular/router";
import { Device } from '@capacitor/device';
import { Platform } from '@ionic/angular'; // Import Platform

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private route: Router,
    private platform: Platform // Inject Platform
  ) {}

  async signOut() {
    localStorage.removeItem('session');
    localStorage.removeItem('isAcces');
    await this.route.navigateByUrl("/home");
  }

  isAcces() {
    if (localStorage.getItem('isAcces') === 'true') {
      return true;
    } else if (localStorage.getItem('isAcces') == 'false') {
      return false;
    } else {
      return false;
    }
  }

  session() {
    if (localStorage.getItem('session')) {
      // @ts-ignore
      return JSON.parse(localStorage.getItem('session'));
    }
  }

  async getDeviceInfo() {
    const deviceInfo = await Device.getInfo(); // Use Capacitor's Device plugin
    return {
      model: deviceInfo.model, // Device model
      platform: deviceInfo.platform, // OS platform
      version: deviceInfo.osVersion, // OS version
      manufacturer: deviceInfo.manufacturer // Device manufacturer
    };
  }

  getWebBrowserInfo() {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      colorDepth: window.screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  async getIPAddress() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip; // User's public IP address
    } catch (error) {
      console.error('Error fetching IP address:', error);
      return 'Unknown IP';
    }
  }

  async getDynamicDeviceInfo() {
    const deviceInfo = this.isMobile() ? await this.getDeviceInfo() : this.getWebBrowserInfo();
    const ipAddress = await this.getIPAddress();

    return {
      ...deviceInfo,
      ipAddress,
    };
  }

  isMobile(): boolean {
    return this.platform.is('android') || this.platform.is('ios');
  }
}