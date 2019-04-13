import { Component, OnInit } from '@angular/core';
import { PowerPromiseService } from '../../core/blockchain/power-promise.service';
import { catchError, flatMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: [ './overview.component.scss' ],
})
export class OverviewComponent implements OnInit {
  promises = [];
  displayedColumns = [ '0', '1', '2', '3', '4', '5', '6', '7' ];
  isLoading = true;

  constructor(private powerPromiseService: PowerPromiseService) {
  }

  ngOnInit() {
    this.getBlockchainData();
  }

  getBlockchainData() {
    this.isLoading = true;

    this.powerPromiseService.length().pipe(
      flatMap(length => this.powerPromiseService.retrieve(length)),
      catchError(err => {
        console.error(err);
        this.isLoading = false;
        return throwError(err);
      })
    ).subscribe((data) => {
      this.promises = data;
      this.isLoading = false;
    });
  }
}
