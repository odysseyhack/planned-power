import {Injectable} from '@angular/core';
import contract from 'truffle-contract';
import {environment} from '../../../environments/environment';
import Web3 from 'web3';
import {AuthService} from './auth.service';
import {Subject} from 'rxjs';

declare let window: any;

@Injectable({ providedIn: 'root' })
export class Web3Service {

  private web3: any;
  private readonly address: string = environment.path;
  private accounts: string[];
  private sendDefaults = { from: undefined, 'gas': '4400000' };
  private servicePromise: Promise<any>;

  private vmwareAddresses = {
    from: '0x262c0d7ab5ffd4ede2199f6ea793f819e1abb019',
    powerpromise: '0x69327263d1c49efd5e462035759b767ab6db5d82'
  };
  initialized = new Subject<boolean>();

  constructor(private authService: AuthService) {
    this.authService.loginLocally('admin@blockchain.local', 'T3sting!')
      .subscribe(
        () => this.initializeBlockChainBasedOnNetwork()
      );
  }

  initializeBlockChainBasedOnNetwork() {
    if (environment.blockchainType === 'metamask' && window[ 'web3' ]) {
      console.info('using metamask');
      this.web3 = this.metaMask();
    } else if (environment.blockchainType === 'vmware') {
      console.info('using vmware');
      this.web3 = this.vmwareBlockchain();
      console.log('got vmwareblockchain()');
    } else {
      console.info('using ganache');
      this.web3 = this.ganache();
    }

    this.setAccounts();

    this.initialized.next(true);
  }

  private vmwareBlockchain(): Web3 {
    console.log('web3.vmWareBlockchain');
    return new Web3(this.authService.getVmwareBlockChainProvider(this.getHrefToBlockchain()));
  }

  private metaMask(): Web3 {
    return new Web3(window[ 'web3' ].currentProvider);
  }

  private ganache(): Web3 {
    const href = this.getHrefToBlockchain();
    return new Web3(new Web3.providers.HttpProvider(href));
  }

  private getHrefToBlockchain() {
    const baseHref = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
    const href = environment.useProxy ? `${baseHref}/${this.address}` : this.address;
    console.info(`connecting to ${href}`);
    return href;
  }

  private getAccounts(): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.web3.eth.getAccounts(this.callbackToResolve(resolve, reject));
    }).then(async accounts => {
      // @ts-ignore
    });

  }

  private setAccounts() {
    this.accounts = [ this.vmwareAddresses.from ];
    this.sendDefaults.from = this.from;
    this.web3.eth.defaultAccount = this.from;
  }

  private callbackToResolve(resolve, reject) {
    return function (error, value) {
      if (error) {
        reject(error);
      } else {
        resolve(value);
      }
    };
  }

  public async artifactsToContract(artifacts) {
    console.log('artifacts to contracts');
    if (!this.web3) {
      const delay = new Promise(resolve => setTimeout(resolve, 100));
      await delay;
      return await this.artifactsToContract(artifacts);
    }

    console.log('artifacts 2');
    const contractAbstraction = contract(artifacts);
    contractAbstraction.setProvider(this.web3.currentProvider);
    console.log('artifacts3');
    return contractAbstraction;

  }

  public from() {
    return { from: this.accounts[ 0 ] };
  }

}
