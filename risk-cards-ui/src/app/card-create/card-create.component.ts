import { ChangeContext, PointerType } from '@angular-slider/ngx-slider';
import { ConditionalExpr } from '@angular/compiler';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Options } from 'ng5-slider/options';
import { CardService } from '../card-service/card.service';
import { CardForm } from '../types';

@Component({
  selector: 'app-card-create',
  templateUrl: './card-create.component.html',
  styleUrls: ['./card-create.component.scss'],
})
export class CardCreateComponent {
  cardForm: FormGroup;
  exposure = 50;
  apr = 0.0;
  options: Options = {
    floor: 0,
    ceil: 100,
    hideLimitLabels: true,
    hidePointerLabels: true,
  };
  idleCDOs;
  selectDisabled = 'disabled';
  @Output() cardCreated: EventEmitter<CardForm> = new EventEmitter();

  constructor(private fb: FormBuilder, private ps: CardService) {
    this.cardForm = this.fb.group({
      idleCDO: this.fb.control(''),
      cardItem: this.fb.group({
        idleCDO: this.fb.control(''),
        exposure: this.fb.control('', [Validators.required]),
        amount: this.fb.control(''),
      })
    });
  }

  ngOnInit() {
    this.ps.getIdleCDOs().then((cdos) => {
      this.idleCDOs = cdos;
      this.cardForm.get('idleCDO').setValue(this.idleCDOs[0]);
      this.updateIdleCDO();
    });
  }

  submitForm() {
    const cardItem = this.cardForm.get('cardItem').value;
    const formData: CardForm = {
      exposure: cardItem.exposure,
      amount: cardItem.amount,
      idleCDOAddress: cardItem.idleCDO.address,
    };

    this.cardCreated.emit(formData);
  }

  onUserChange(changeContext: ChangeContext): void {
    this.updateIdleCDO();
    const cardItem = this.cardForm.get('cardItem').value;
    this.ps.getApr(cardItem.idleCDO, cardItem.exposure).then((v) => (this.apr = v));
  }

  updateIdleCDO () {
    this.cardForm.get('cardItem').get('idleCDO').setValue(this.cardForm.get('idleCDO').value);
  }

}
