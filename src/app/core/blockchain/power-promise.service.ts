import { Injectable } from '@angular/core';
import { from, Observable, ReplaySubject } from 'rxjs';
import { flatMap, tap } from 'rxjs/operators';
import { Web3Service } from './web3.service';
import { PowerUse } from './power-use';

const abi = require('../../../assets/contracts/PowerPromise.json');
declare let require: any;

@Injectable({
  providedIn: 'root'
})
export class PowerPromiseService {

  private powerPromise = new ReplaySubject<any>();

  constructor(private web3Service: Web3Service) {
    this.init();
  }

  private async init(): Promise<void> {
    const contract = await this.web3Service.artifactsToContract(abi);
    const deployed = await contract.deployed();
    this.powerPromise.next(deployed);
    this.powerPromise.complete();
  }

  promise(
    promise: PowerUse
  ): Observable<any> {
    return this.powerPromise.pipe(
      flatMap(contract => from(
        contract.promise(
          promise.region,
          promise.startday, promise.starttime,
          promise.endday, promise.endtime,
          promise.begincapacity,
          promise.minimalcapacity,
          promise.fullcapicity, this.web3Service.from())
      )),
      tap(console.log)
    );
  }

  retrieve(): Observable<PowerUse[]> {
    return this.powerPromise.pipe(
      flatMap(contract => from(
        contract.retrieve(this.web3Service.from())
      )),
      tap(console.log)
    );
  }


}
