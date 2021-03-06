import { Injectable } from '@angular/core';
import { Card, CardForm, CardGroup } from '../types';
import { Web3Service } from '../blockchain/web3.service';
import { toBN } from 'web3-utils';
import * as idleCDOsData from '../../assets/idle-cdos.json';

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
    console.log('contract name:', name, ' account:', acc);
    const balance = await this.getBalance(acc)
    console.log('Idle Risk Cards for balance of Cards: ', balance);

    const cards: CardGroup[] = [];
    for (let index = 0; index < balance; index++) {
      const tokenId = await this.web3.call('tokenOfOwnerByIndex', acc, index);
      const cardIndexIds = await this.web3.call('cardIndexes', tokenId);
      cards.push({ tokenId: tokenId, cards: await this.buildCards(tokenId,cardIndexIds)});
    }
    return cards;
  }

  async getAccount() {
    return await this.web3.getAccount();
  }

  async isValidNetwork() {
    const network = await this.web3.getNetworkId();
    return network === 31337;
  }

  async getApr(idleCDO, exposure: number) {
    const exp = toBN(exposure).mul(toBN(10).pow(toBN(16)));
    const apr = toBN(await this.web3.call('getApr', idleCDO.address, exp))
      .div(toBN(10).pow(toBN(16)))
      .toNumber();
    return apr ? apr / 100 : 0;
  }

  async getUnderlyingBalance(idleCDO: any) {
   const balance = await this.web3.getERC20Balance(idleCDO.underlying);
   return toBN(balance)
          .div(toBN(10).pow(toBN(16)))
          .toNumber() / 100;
  }

  createCard(cardItems: CardForm[]) {
    const cardItemToMint: CardForm[] = [... cardItems];

    const _addresses = cardItemToMint.map((item) => item.idleCDOAddress);
    const _exposures = cardItemToMint.map((item) => toBN(item.exposure).mul(toBN(10).pow(toBN(16))).toString());
    const _amounts = cardItemToMint.map((item) => toBN(Math.trunc(item.amount * 10 ** 2)).mul(toBN(10).pow(toBN(16))).toString());

    this.web3.executeTransaction(
      'mint',
      _addresses,
      _amounts,
      _exposures
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

  private async buildCards(tokenId:any,cardIndexIds: any){
    const cards: Card[]= [];
    for (let i = 0; i < cardIndexIds.length; i++) {
      cards.push(await this.buildCard(tokenId,i));
    }
    return cards;
  }

  private async buildCard(tokenId:any,cardIndexId: any) {
    const pos: CardForm = await this.web3.call('card', tokenId,cardIndexId);
    const apr: number = toBN(await this.web3.call('getApr', pos.idleCDOAddress, pos.exposure))
      .div(toBN(10).pow(toBN(16)))
      .toNumber() / 100;
    const card = {
      tokenId: tokenId,
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

  private async getBalance (acc) {
    if(!acc || acc.length===0) {
      return 0;
    }
    return await this.web3.call('balanceOf', acc);
  }
}
