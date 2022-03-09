export interface CardForm {
  amount: number; // amount 18d
  exposure: number; // exposure 18d
  idleCDOAddress: string; // idleCDOAddress 0x...
}

export interface Card extends CardForm {
  tokenId: number;
  apr: number;
  idleCDO: any;
}

export interface CardGroup {
  tokenId: number;
  cards: Card[];
}
