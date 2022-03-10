export interface CardForm {
  idleCDOAddress: string; // idleCDOAddress 0x...
  amount: number; // amount 18d
  exposure: number; // exposure 18d
  apr: number;
  idleCDO: any;
}

export interface Card extends CardForm {
  tokenId: number;
}

export interface CardGroup {
  tokenId: number;
  cards: Card[];
}
