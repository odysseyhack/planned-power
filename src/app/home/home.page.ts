import { Component, OnInit } from '@angular/core';
import { catchError, flatMap } from 'rxjs/operators';
import { PowerPromiseService } from '../core/blockchain/power-promise.service';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: [ 'home.page.scss' ],
})
export class HomePage implements OnInit {

  constructor(private powerPromiseService: PowerPromiseService) {
  }

  ngOnInit() {

  }

  async sendAndRetrieve() {

    this.powerPromiseService.promise({
      region: 'Beijum',
      startday: '01-01-1010',
      starttime: '11:30, ',
      endday: '02-02-2020',
      endtime: '23:34',
      fullcapicity: 100,
      minimalcapacity: 20,
      begincapacity: 80
    }).pipe(
      flatMap(() => this.powerPromiseService.length()),
      flatMap(length => this.powerPromiseService.retrieve(length)),
      catchError(err => {
        console.error(err);
        return throwError(err);
      }),
    ).subscribe(console.table);
  }

  async retrieve() {
    this.powerPromiseService.length()
      .pipe(
        flatMap(() => this.powerPromiseService.length()),
        flatMap(length => this.powerPromiseService.retrieve(length))
      ).subscribe(console.table);
  }

}
