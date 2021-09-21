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

  async getCards(): Promise<Card[]> {
    const acc = await this.web3.getAccount();
    const name = await this.web3.call('name');
    console.log('contract name: ', name, ' account: ', acc);
    const balance = await this.web3.call('balanceOf', acc);
    console.log('Idle Risk Cards for balance of Cards: ', balance);

    const cards: Card[] = [];
    for (let index = 0; index < balance; index++) {
      const tokenId = await this.web3.call('tokenOfOwnerByIndex', acc, index);
      const pos: CardForm = await this.web3.call('position', tokenId);
      const apr: number =
        toBN(await this.web3.call('getApr', pos.exposure))
          .div(toBN(10).pow(toBN(16)))
          .toNumber() / 100;
      cards.push(
        this.normalize({
          tokenId,
          apr,
          amount: pos.amount,
          exposure: pos.exposure,
        })
      );
    }
    return cards;
  }

  async getApr(exposure: number) {
    const exp = toBN(exposure).mul(toBN(10).pow(toBN(16)));
    const apr = toBN(await this.web3.call('getApr', exp))
      .div(toBN(10).pow(toBN(16)))
      .toNumber();
    return apr ? apr / 100 : 0;
  }

  createCard(card: CardForm) {
    this.web3.executeTransaction(
      'mint',
      toBN(card.exposure).mul(toBN(10).pow(toBN(16))),
      toBN(card.amount).mul(toBN(10).pow(toBN(18)))
    );
  }

  burn(tokenId: number) {
    this.web3.executeTransaction('burn', tokenId);
  }

  private normalize(card: Card): Card {
    return {
      tokenId: card.tokenId,
      apr: card.apr,
      exposure: toBN(card.exposure)
        .div(CardService.PRECISION.div(toBN(100)))
        .toNumber(),
      amount: toBN(card.amount).div(CardService.PRECISION).toNumber(),
    };
  }

  onEvent(name: string) {
    return this.web3.onEvents(name);
  }
}
