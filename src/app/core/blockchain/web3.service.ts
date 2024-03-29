import { Injectable } from '@angular/core';
import contract from 'truffle-contract';
import { environment } from '../../../environments/environment';
import Web3 from 'web3';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs';

declare let window: any;

@Injectable({ providedIn: 'root' })
export class Web3Service {

  private web3: any;
  private readonly address: string = environment.path;
  private accounts: string[];
  private sendDefaults = { from: undefined, 'gas': '4400000' };

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
      this.web3 = this.metaMask();
    } else if (environment.blockchainType === 'vmware') {
      this.web3 = this.vmwareBlockchain();
    } else {
      this.web3 = this.ganache();
    }

    this.setAccounts();

    this.initialized.next(true);
  }

  private vmwareBlockchain(): Web3 {
    return new Web3(this.authService.getVmwareBlockChainProvider());
  }

  private metaMask(): Web3 {
    return new Web3(window[ 'web3' ].currentProvider);
  }

  private ganache(): Web3 {
    const baseHref = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
    const href = environment.useProxy ? `${baseHref}/${this.address}` : this.address;
    return new Web3(new Web3.providers.HttpProvider(href));
  }

  private setAccounts() {
    this.accounts = [ this.vmwareAddresses.from ];
    this.sendDefaults.from = this.from;
    this.web3.eth.defaultAccount = this.from;
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
    return { from: this.accounts[ 0 ] };
  }

}
