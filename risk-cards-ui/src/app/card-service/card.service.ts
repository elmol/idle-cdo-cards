import { Injectable } from '@angular/core';
import { Card, CardForm } from '../types';
import { Web3Service } from '../blockchain/web3.service';
import { toBN } from 'web3-utils';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  constructor(private web3: Web3Service) {}

  static PRECISION: any = toBN(10).pow(toBN(18));

  idleCDOs = [{ name: "DAI", symbol: "DAI", decimals: 18, address: "0xDC11f7E700A4c898AE5CAddB1082cFfa76512aDD" },{ name: "FEI", symbol: "FEI", decimals: 18, address: "0x51A1ceB83B83F1985a81C295d1fF28Afef186E02" }];

  async getCards(): Promise<Card[]> {
    const acc = await this.web3.getAccount();
    const name = await this.web3.call('name');
    console.log('contract name: ', name, ' account: ', acc);
    const balance = await this.web3.call('balanceOf', acc);
    console.log('Idle Risk Cards for balance of Cards: ', balance);

    const cards: Card[] = [];
    for (let index = 0; index < balance; index++) {
      const tokenId = await this.web3.call('tokenOfOwnerByIndex', acc, index);
      const pos: CardForm = await this.web3.call('card', tokenId);
      const apr: number =
        toBN(await this.web3.call('getApr',this.idleCDOs[0].address, pos.exposure))  //TODO: FIX THIS
          .div(toBN(10).pow(toBN(16)))
          .toNumber() / 100;
      cards.push(
        this.normalize({
          tokenId,
          apr,
          amount: pos.amount,
          exposure: pos.exposure,
          idleCDO: this.idleCDOs[0] //TODO: FIX THIS
        })
      );
    }
    return cards;
  }

  async getApr(idleCDO, exposure: number) {
    const exp = toBN(exposure).mul(toBN(10).pow(toBN(16)));
    const apr = toBN(await this.web3.call('getApr', idleCDO.address, exp))
      .div(toBN(10).pow(toBN(16)))
      .toNumber();
    return apr ? apr / 100 : 0;
  }

  createCard(card: CardForm) {
    this.web3.executeTransaction(
      'mint',
      card.idleCDO.address,
      toBN(card.exposure).mul(toBN(10).pow(toBN(16))),
      toBN(card.amount).mul(toBN(10).pow(toBN(18)))
    );
  }

  burn(tokenId: number) {
    this.web3.executeTransaction('burn', tokenId);
  }

  async getIdleCDOs() {
   const addresses =await this.web3.call('getIdleCDOs')
   console.log("Idle CDOs: ", addresses);
   // const addresses = ["0x6B175474E89094C44Da98b954EedeAC495271d0F" , "0xF5D915570BC477f9B8D6C0E980aA81757A3AaC36"];
    // filter idleCDOs by addresses
    return this.idleCDOs.filter(idleCDO => addresses.includes(idleCDO.address));
  }

  private normalize(card: Card): Card {
    return {
      tokenId: card.tokenId,
      apr: card.apr,
      exposure: toBN(card.exposure)
        .div(CardService.PRECISION.div(toBN(100)))
        .toNumber(),
      amount: toBN(card.amount).div(CardService.PRECISION).toNumber(),
      idleCDO: card.idleCDO
    };
  }

  onEvent(name: string) {
    return this.web3.onEvents(name);
  }
}
