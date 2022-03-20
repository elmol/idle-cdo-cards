import { Component, OnInit } from '@angular/core';
import { CardForm } from './types';
import { CardService } from './card-service/card.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  cardGroups = this.ps.getCardGroups();
  totalGroups = this.getTotalCards();
  account = "0x0";

  constructor(private ps: CardService) {}

  ngOnInit() {
    // TODO: emit other event type
    this.ps.onEvent('Transfer').subscribe(() => {
      this.cardGroups = this.ps.getCardGroups();
      this.totalGroups = this.getTotalCards();
    });
    this.ps.getAccount().then(acc => {
      if(acc) {
        this.account = acc.slice(0, 6) + '...' + acc.slice(acc.length - 4);
      }
    });
  }

  handleCardCreate(card: CardForm[]) {
    this.ps.createCard(card);
  }

  async getTotalCards(): Promise<number>{
    return (await this.cardGroups)?.length;
  }

  handleCardBurn(tokenId: number) {
    this.ps.burn(tokenId);
  }
}
