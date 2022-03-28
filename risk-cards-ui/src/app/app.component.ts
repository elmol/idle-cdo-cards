import { Component, OnInit } from '@angular/core';
import { CardForm, CardGroup } from './types';
import { CardService } from './card-service/card.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  cardGroups = this.ps.getCardGroups();
  totalGroups = this.getTotalCards();
  idleCDOBalances = this.getIdleCDOBalances(this.cardGroups);
  account = '0x0';

  constructor(private ps: CardService) {}

  ngOnInit() {
    // TODO: emit other event type
    this.ps.onEvent('Transfer').subscribe(() => {
      this.cardGroups = this.ps.getCardGroups();
      this.totalGroups = this.getTotalCards();
      this.idleCDOBalances = this.getIdleCDOBalances(this.cardGroups);
    });
    this.getIdleCDOBalances(this.cardGroups).then((balances) => {
      console.log(balances);
    });

    this.ps.getAccount().then((acc) => {
      if (acc) {
        this.account = acc.slice(0, 6) + '...' + acc.slice(acc.length - 4);
      }
    });
  }

  handleCardCreate(card: CardForm[]) {
    this.ps.createCard(card);
  }

  async getTotalCards(): Promise<number> {
    return (await this.cardGroups)?.length;
  }

  async getIdleCDOBalances(cardGroups: Promise<CardGroup[]>) {
    const idleCDOBalance = new Map<any, number>();
        (await cardGroups).forEach((group) => {
        group.cards.forEach((card) => {
          const totalBalance = idleCDOBalance.get(card.idleCDO) || 0;
          idleCDOBalance.set(card.idleCDO, totalBalance + card.amount);
        });
      });

    return idleCDOBalance;
  }

  handleCardBurn(tokenId: number) {
    this.ps.burn(tokenId);
  }

  asIsOrder(a, b) {
    return 1;
}

}
