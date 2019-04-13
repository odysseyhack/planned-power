import { Component, OnInit } from '@angular/core';
import { catchError, flatMap } from 'rxjs/operators';
import { PowerPromiseService } from '../core/blockchain/power-promise.service';
import { throwError } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: [ 'home.page.scss' ],
})
export class HomePage implements OnInit {
  sending: boolean;
  promiseForm = new FormGroup({
    region: new FormControl('Beijum'),
    startday:  new FormControl('01-01-1010'),
    starttime:  new FormControl('11:30'),
    endday:  new FormControl('02-02-2020'),
    endtime:  new FormControl('23:34'),
    fullcapicity:  new FormControl(100),
    minimalcapacity: new FormControl(20),
    begincapacity:  new FormControl(80)
  });

  constructor(private powerPromiseService: PowerPromiseService) {
  }

  ngOnInit() {

  }

  async sendAndRetrieve() {
    this.sending = true;

    let promise = this.promiseForm.value;
    // let promise = {
    //   region: 'Beijum',
    //   startday: '01-01-1010',
    //   starttime: '11:30, ',
    //   endday: '02-02-2020',
    //   endtime: '23:34',
    //   fullcapicity: 100,
    //   minimalcapacity: 20,
    //   begincapacity: 80
    // }
    //
    this.powerPromiseService.promise(promise).pipe(
      flatMap(() => this.powerPromiseService.length()),
      flatMap(length => this.powerPromiseService.retrieve(length)),
      catchError(err => {
        console.error(err);
        this.sending = false;
        return throwError(err);
      }),
    ).subscribe((data) => {
      console.table(data);
      this.sending = false;
    });
  }

  async retrieve() {
    this.powerPromiseService.length()
      .pipe(
        flatMap(() => this.powerPromiseService.length()),
        flatMap(length => this.powerPromiseService.retrieve(length))
      ).subscribe(console.table);
  }

}
