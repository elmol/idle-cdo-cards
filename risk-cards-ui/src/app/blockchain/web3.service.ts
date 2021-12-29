import { Injectable, NgZone } from '@angular/core';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { Observable } from 'rxjs';

const contractAbi = require('./riskCardABI.json');
const erc20Abi = require('./erc20ABI.json');

const contract = require('../../assets/contract.json')[31337]; //localhost
declare var window: any;

@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  private web3: Web3;
  private contract: Contract;

  private contractAddress = contract.address;


  constructor(private zone: NgZone) {
    if (window.web3) {
      this.web3 = new Web3(window.ethereum);
      this.contract = new this.web3.eth.Contract(
        contractAbi,
        this.contractAddress
      );

      window.ethereum.enable().catch((err) => {
        console.log(err);
      });
    } else {
      console.warn('Metamask not found. Install or enable Metamask.');
    }
  }

  getAccount(): Promise<string> {
    return this.web3.eth.getAccounts().then((accounts) => accounts[0] || '');
  }

  async getERC20Balance(erc20Address: string): Promise<string> {
    const erc20contract = new this.web3.eth.Contract(erc20Abi, erc20Address);
    const acc = await this.getAccount();
    return await erc20contract.methods.balanceOf(acc).call({ from: acc });
  }
  async executeTransaction(fnName: string, ...args: any[]): Promise<void> {
    const acc = await this.getAccount();
    this.contract.methods[fnName](...args).send({ from: acc });
  }

  async call(fnName: string, ...args: any[]) {
    const acc = await this.getAccount();
    return this.contract.methods[fnName](...args).call({ from: acc });
  }

  onEvents(event: string) {
    return new Observable((observer) => {
      this.contract.events[event]().on('data', (data) => {
        this.zone.run(() => {
          observer.next({
            event: data.event,
            payload: data.returnValues,
          });
        });
      });
    });
  }
}
