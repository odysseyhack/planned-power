import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { PowerPromiseService } from '../core/blockchain/power-promise.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private powerPromiseService: PowerPromiseService) {
  }

  send(promise: any, hourRange, statuses) {

    const promises = [ '15-04-2019', '16-04-2019', '17-04-2019', '18-04-2019', '19-04-2019', '20-04-2019', '21-04-2019' ]
      .map(
        (date, index) => {
          if (this.shouldOmitFromBlockhain(index, statuses)) {
            return;
          }

          return this.sendToBlockchain(promise, date, hourRange);
        }
      ).filter(Boolean);

    forkJoin(promises).subscribe(() => {
    });
  }

  private sendToBlockchain(promise, date, hourRange) {
    return this.powerPromiseService.promise({
      region: promise.region,
      startday: date,
      starttime: `${hourRange[ 'lower' ]}:00`,
      endday: date,
      endtime: `${hourRange[ 'upper' ]}:00`,
      fullcapicity: 100,
      minimalcapacity: 20,
      begincapacity: 80
    });
  }

  private shouldOmitFromBlockhain(index, statuses) {
    return index === 0 && !statuses.monday ||
      index === 1 && !statuses.tuesday ||
      index === 2 && !statuses.wednesday ||
      index === 3 && !statuses.thursday ||
      index === 4 && !statuses.friday ||
      index === 5 && !statuses.saturday ||
      index === 6 && !statuses.sunday;
  }
}
