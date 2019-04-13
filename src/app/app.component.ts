import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {PowerPromiseService} from './core/blockchain/power-promise.service';
import {flatMap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private powerPromiseService: PowerPromiseService
  ) {
    this.initializeApp();
    this.powerPromiseService.promise(
      'Beijum',
      '01-01-1010',
      '11:30, ',
      '02-02-2020',
      '23:34',
      100,
      20,
      80
      ).pipe(
        flatMap(() => this.powerPromiseService.retrieve())
    ).subscribe(console.log);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
