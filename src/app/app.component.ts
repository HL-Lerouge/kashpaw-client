import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
import {Platform} from "@ionic/angular";
import {Router} from "@angular/router";
import {AuthService} from "./services/auth.service";
import { BackButtonEvent } from '@ionic/core';
import { App } from '@capacitor/app';

register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  interval :any
  constructor(private platform:Platform,private router:Router,private authS:AuthService) {

       //   this.checkDeviceType();

  }
  

  // checkDeviceType() {
  //   // Check if desktop or large screen
  //   const isMobile = this.platform.is('mobile') || this.platform.is('mobileweb');
  //   const isSmallScreen = this.platform.width() <= 768;
    
  //   if (!isMobile && !isSmallScreen) {
  //      this.router.navigate(['/desktop-redirect']);
  //   }else{
  //     this.router.navigate(['/home']);
  //   }
  // }

}
