export interface CardForm {
  amount: number; // amount 18d
  exposure: number; // exposure 18d
}

export interface Card extends CardForm {
  tokenId: number;
  apr: number;
}

