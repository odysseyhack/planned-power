import {Injectable} from '@angular/core';
import {from, Observable, pipe, ReplaySubject} from 'rxjs';
import {flatMap, tap} from 'rxjs/operators';
import {Web3Service} from './web3.service';

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

  promise(payload: number, use: number, from_date: string, to_date: string, postcode: string): Observable<any> {
    return this.powerPromise.pipe(
      flatMap(contract => from(
        contract.promise(payload, use, from_date, to_date, postcode, this.web3Service.from())
        // contract.promise(payload, use, from_date, to_date, postcode, {from: web3.eth.defaultAccount})
        // contract.methods.promise(payload, use, from_date, to_date, postcode).send({from: web3.eth.defaultAccount})
      )),
      tap(console.log)
    );
  }
}
