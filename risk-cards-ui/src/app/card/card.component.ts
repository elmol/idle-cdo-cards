import { ChangeContext, PointerType } from '@angular-slider/ngx-slider';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() tokenId: number;
  @Input() apr: number;
  @Input() amount: number;
  @Input() exposure: number;

  @Output() cardBurned: EventEmitter<number> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
  }

  onBurn(): void {
    this.cardBurned.emit(this.tokenId);
  }
}
