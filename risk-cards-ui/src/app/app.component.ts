import { Component, OnInit } from '@angular/core';
import { CardForm } from './types';
import { CardService } from './card-service/card.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  cards = this.ps.getCards();

  constructor(private ps: CardService) {}

  ngOnInit() {
    // TODO: emit other event type
    this.ps.onEvent('Transfer').subscribe(() => {
      this.cards = this.ps.getCards();
    });
  }

  handleCardCreate(card: CardForm) {
    this.ps.createCard(card);
  }

  handleCardBurn(tokenId: number) {
    this.ps.burn(tokenId);
  }
}
