export interface CardForm {
  amount: number; // amount 18d
  exposure: number; // exposure 18d
  idleCDO: any;
}

export interface Card extends CardForm {
  tokenId: number;
  apr: number;
}
