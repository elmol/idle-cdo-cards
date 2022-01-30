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

  constructor(private ps: CardService) {}

  ngOnInit() {
    // TODO: emit other event type
    this.ps.onEvent('Transfer').subscribe(() => {
      this.cardGroups = this.ps.getCardGroups();
    });
  }

  handleCardCreate(card: CardForm[]) {
    this.ps.createCard(card);
  }

  handleCardBurn(tokenId: number) {
    this.ps.burn(tokenId);
  }
}
