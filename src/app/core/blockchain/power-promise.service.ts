import {Injectable} from '@angular/core';
import {from, Observable, ReplaySubject, throwError} from 'rxjs';
import {catchError, flatMap, map} from 'rxjs/operators';
import {Web3Service} from './web3.service';
import {PowerUse} from './power-use';
import {forkJoin} from 'rxjs/internal/observable/forkJoin';

const abi = require('../../../assets/contracts/PowerPromise.json');
declare let require: any;

@Injectable({
  providedIn: 'root'
})
export class PowerPromiseService {

  private powerPromiseContract = new ReplaySubject<any>();

  constructor(private web3Service: Web3Service) {
    this.web3Service.initialized
      .subscribe(() => this.init());
  }

  async init(): Promise<void> {
    console.log('init powerpromiseservice');
    const contract = await this.web3Service.artifactsToContract(abi);
    console.log('after await artifacts');
    const deployed = await contract.deployed();
    console.log('after deployed');
    this.powerPromiseContract.next(deployed);
    this.powerPromiseContract.complete();
  }

  promise(
    promise: PowerUse
  ): Observable<any> {
    return this.powerPromiseContract.pipe(
      flatMap(contract => from(
        contract.promise(
          promise.region,
          promise.startday, promise.starttime,
          promise.endday, promise.endtime,
          promise.begincapacity,
          promise.minimalcapacity,
          promise.fullcapicity, this.web3Service.from())
      )),
      catchError(err => {
        console.error(err);
        return throwError(err);
      }),
    );
  }

  length(): Observable<any> {
    return this.powerPromiseContract.pipe(
      flatMap(contract => from(
        contract.getLength(this.web3Service.from())
        ),
      ));
  }

  retrieve(length: number): Observable<any> {
    return this.powerPromiseContract.pipe(
      flatMap(contract => {
          const usages = [];
          for (let i = 0; i < length; i++) {
            usages.push(contract.getPowerPromise(i));
          }
          return forkJoin(usages)
            .pipe(
              map(results => results.map((result) => ({
                ...result,
                5: result[5].toNumber(),
                6: result[6].toNumber(),
                7: result[7].toNumber()
              })))
            );
        }
      )
    );
  }


}
