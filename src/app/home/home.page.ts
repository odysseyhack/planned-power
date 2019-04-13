import {Component} from '@angular/core';
import {catchError, flatMap} from 'rxjs/operators';
import {PowerPromiseService} from '../core/blockchain/power-promise.service';
import {throwError} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private powerPromiseService: PowerPromiseService) {
  }

  onClick(): void {
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
      flatMap(() => this.powerPromiseService.retrieve()),
      catchError(err => {
        console.error(err);
        return throwError(err)
      }),
    ).subscribe(console.log);
  }

}
