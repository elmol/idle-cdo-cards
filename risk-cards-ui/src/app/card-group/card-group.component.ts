import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Card } from '../types';

@Component({
  selector: 'app-card-group',
  templateUrl: './card-group.component.html',
  styleUrls: ['./card-group.component.scss']
})
export class CardGroupComponent implements OnInit {

  @Input() tokenId: number;
  @Input() cards: Promise<Card[]>;

  @Output() cardBurned: EventEmitter<number> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
  }

  onBurn(): void {
    this.cardBurned.emit(this.tokenId);
  }

  handleCardBurn(tokenId: number) {
  }


}
