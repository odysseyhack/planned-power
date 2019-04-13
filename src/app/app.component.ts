import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { PowerPromiseService } from './core/blockchain/power-promise.service';
import { flatMap } from 'rxjs/operators';
import { PowerUse } from './core/blockchain/power-use';

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
    this.powerPromiseService.promise({
      region: 'Beijum',
      startday: '01-01-1010',
      starttime: '11:30, ',
      endday: '02-02-2020',
      endtime: '23:34',
      fullcapicity: 100,
      minimalcapacity: 20,
      begincapacity: 80
    } as PowerUse).pipe(
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
