import { Injectable } from '@angular/core';
import { Card, CardForm, CardGroup } from '../types';
import { Web3Service } from '../blockchain/web3.service';
import { toBN } from 'web3-utils';
import * as idleCDOsData from '../../assets/idle-cdos.json';
import { ifStmt } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  constructor(private web3: Web3Service) {}

  static PRECISION: any = toBN(10).pow(toBN(18));

  idleCDOs = idleCDOsData.default;

  async getCardGroups(): Promise<CardGroup[]> {
    const acc = await this.web3.getAccount();
    const name = await this.web3.call('name');
    console.log('contract name: ', name, ' account: ', acc);
    const balance = await this.web3.call('balanceOf', acc);
    console.log('Idle Risk Cards for balance of Cards: ', balance);

    const cards: CardGroup[] = [];
    for (let index = 0; index < balance; index++) {
      console.log('index: ', index);
      const tokenId = await this.web3.call('tokenOfOwnerByIndex', acc, index);
      console.log('tokenId: ', tokenId);
      const tokenIds = await this.web3.call('cardGroup', tokenId);
      cards.push({ tokenId: tokenId, cards: await this.buildCards(tokenIds) });
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

  createCard(card: CardForm[]) {
    this.web3.executeTransaction(
      'combine',
      card[0].idleCDOAddress,
      toBN(card[0].exposure).mul(toBN(10).pow(toBN(16))),
      toBN(Math.trunc(card[0].amount * 10 ** 2)).mul(toBN(10).pow(toBN(16))),
      card[1].idleCDOAddress,
      toBN(card[1].exposure).mul(toBN(10).pow(toBN(16))),
      toBN(Math.trunc(card[1].amount * 10 ** 2)).mul(toBN(10).pow(toBN(16)))
    );
  }

  burn(tokenId: number) {
    this.web3.executeTransaction('burn', tokenId);
  }

  async getIdleCDOs() {
    const addresses = await this.web3.call('getIdleCDOs');
    console.log('Idle CDOs: ', addresses);
    // const addresses = ["0x6B175474E89094C44Da98b954EedeAC495271d0F" , "0xF5D915570BC477f9B8D6C0E980aA81757A3AaC36"];
    // filter idleCDOs by addresses
    return this.idleCDOs.filter((idleCDO) =>
      addresses.includes(idleCDO.address)
    );
  }

  private async buildCards(tokenIds: any){
    const cards: Card[] = [await this.buildCard(tokenIds[0])];
    console.log("tokens ids: " + tokenIds);
    if(tokenIds[1] != 0){
      console.log("pushing second card");
      cards.push(await this.buildCard(tokenIds[1]));
    }
    return cards;
  }

  private async buildCard(cardTokenId: any) {
    const pos: CardForm = await this.web3.call('card', cardTokenId);
    const apr: number = toBN(await this.web3.call('getApr', pos.idleCDOAddress, pos.exposure))
      .div(toBN(10).pow(toBN(16)))
      .toNumber() / 100;
    const card = {
      tokenId: cardTokenId,
      apr,
      amount: pos.amount,
      exposure: pos.exposure,
      idleCDOAddress: pos.idleCDOAddress,
      idleCDO: this.idleCDOs.find(
        (idleCDO) => idleCDO.address === pos.idleCDOAddress
      ),
    };

    const normalizedCard = this.normalize(card);
    return normalizedCard;
  }

  private normalize(card: Card): Card {
    return {
      tokenId: card.tokenId,
      apr: card.apr,
      exposure: toBN(card.exposure)
        .div(CardService.PRECISION.div(toBN(100)))
        .toNumber(),
      amount:
        toBN(card.amount)
          .div(toBN(10).pow(toBN(16)))
          .toNumber() / 100,
      idleCDO: card.idleCDO,
      idleCDOAddress: card.idleCDOAddress,
    };
  }

  onEvent(name: string) {
    return this.web3.onEvents(name);
  }
}
