import {Injectable} from '@angular/core';
import contract from 'truffle-contract';
import {environment} from '../../../environments/environment';
import Web3 from 'web3';

declare let window: any;

@Injectable({providedIn: 'root'})
export class Web3Service {

  private readonly web3: any;
  private readonly address: string = environment.path;
  private accounts: string[];
  private sendDefaults = { from: undefined, 'gas': '4400000' };
  private servicePromise: Promise<any>;

  constructor() {
    if (environment.blockchainType === 'metamask' && window['web3']) {
      this.web3 = this.metaMask();
    } else if (environment.blockchainType === 'vmware') {
      // this.web3 = this.vmwareBlockchain();
      throw new Error('not implemented yet');
    } else {
      this.web3 = this.ganache();
    }

    this.servicePromise = this.getAccounts();
  }

  private metaMask(): Web3 {
    return new Web3(window['web3'].currentProvider);
  }

  // private vmwareBlockchain(): Web3 {
  //   return new Web3(this.authService.getVmwareBlockChainProvider());
  // }

  private ganache(): Web3 {
    return new Web3(new Web3.providers.HttpProvider(this.address));
  }

  private getAccounts(): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.web3.eth.getAccounts(this.callbackToResolve(resolve, reject));
    }).then(async accounts => {
      // @ts-ignore
      this.accounts = accounts;
      this.sendDefaults.from = this.from;
      this.web3.eth.defaultAccount = this.from;
    });

  }

  private callbackToResolve(resolve, reject) {
    return function(error, value) {
      if (error) {
        reject(error);
      } else {
        resolve(value);
      }
    };
  }

  public async artifactsToContract(artifacts) {
    if (!this.web3) {
      const delay = new Promise(resolve => setTimeout(resolve, 100));
      await delay;
      return await this.artifactsToContract(artifacts);
    }

    const contractAbstraction = contract(artifacts);
    contractAbstraction.setProvider(this.web3.currentProvider);
    return contractAbstraction;

  }

  public from() {
    return {from: this.accounts[0]};
  }
}
