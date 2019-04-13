import {Injectable} from '@angular/core';
import {from, Observable, ReplaySubject, throwError} from 'rxjs';
import {catchError, flatMap} from 'rxjs/operators';
import {Web3Service} from './web3.service';
import {PowerUse} from './power-use';

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
    region          : string,
    startday        : string,
    starttime       : string,
    endday          : string,
    endtime         : string,
    begincapacity   : number,
    minimalcapacity : number,
    fullcapicity    : number
  ): Observable<any> {
    return this.powerPromise.pipe(
      flatMap(contract => from(
        contract.promise(region, startday, starttime, endday, endtime, begincapacity, minimalcapacity, fullcapicity, this.web3Service.from())
      )),
      catchError(err => {
        console.error(err);
        return throwError(err)
      }),
    );
  }

  retrieve(): Observable<PowerUse[]> {
    return this.powerPromise.pipe(
      flatMap(contract => from(
        contract.retrieve(this.web3Service.from())
      )),
    );
  }



}
