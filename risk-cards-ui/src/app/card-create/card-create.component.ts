import { ChangeContext, PointerType } from '@angular-slider/ngx-slider';
import { ConditionalExpr } from '@angular/compiler';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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
  underlyingBalance = 0;

  exposure = 50;
  apr = 0.0;
  options: Options = {
    floor: 0,
    ceil: 100,
    hideLimitLabels: true,
    hidePointerLabels: true,
  };
  idleCDOs;
  initialIdleCDOs;
  selectDisabled = 'disabled';
  cardItems: CardForm[] = [];

  @Output() cardCreated: EventEmitter<CardForm[]> = new EventEmitter();

  constructor(private fb: FormBuilder, private ps: CardService) {
    this.cardForm = this.fb.group({
      idleCDO: this.fb.control(''),
      cardItem: this.fb.group({
        idleCDO: this.fb.control(''),
        exposure: this.fb.control('', [Validators.required]),
        amount: this.fb.control(''),
      }),
    });
  }

  ngOnInit() {
    this.ps.getIdleCDOs().then((cdos) => {
      this.idleCDOs = cdos;
      this.initialIdleCDOs = cdos;
      this.cardForm.get('idleCDO').setValue(this.idleCDOs[0]);
      this.updateIdleCDO();
      this.updateAPR();
      this.updateUnderlyingBalance();
    });
    // TODO: emit other event type
    this.ps.onEvent('Transfer').subscribe(() => {
      this.updateUnderlyingBalance();
      this.cardItems = [];
      this.idleCDOs = this.initialIdleCDOs;
      this.updateIdleCDOs();
    });
  }

  submitForm() {
    console.log('Card items to mint: ', this.cardItems);
    this.cardCreated.emit(this.cardItems);
  }

  onAddCardItem(changeContext: ChangeContext) {
    const cardItem = this.cardForm.get('cardItem').value;
    const cardItemForm: CardForm = {
      exposure: cardItem.exposure,
      amount: cardItem.amount,
      idleCDOAddress: cardItem.idleCDO.address,
      apr: this.apr,
      idleCDO: this.cardForm.get('idleCDO').value,
    };
    this.cardItems.push(cardItemForm);
    console.log('Card items added: ', this.cardItems);
    this.updateIdleCDOs();
    this.updateUnderlyingBalance();
  }

  onRemoveCardItem(cardItem: CardForm) {
    this.cardItems = this.cardItems.filter((item) => item !== cardItem);
    this.updateIdleCDOs();
    this.updateUnderlyingBalance();
    console.log('Card items removed: ', this.cardItems);
  }

  onUserChange(changeContext: ChangeContext): void {
    this.updateIdleCDO();
    this.updateAPR();
  }

  onUserSelect(changeContext: ChangeContext): void {
    this.updateIdleCDO();
    this.updateAPR();
    this.updateUnderlyingBalance();
  }


  updateIdleCDOs() {
    this.idleCDOs = this.initialIdleCDOs.filter(
      (item) =>
        this.cardItems.findIndex((cardItem) => cardItem.idleCDO === item) === -1
    );
    if (this.idleCDOs.length === 0) {
      this.cardForm.disable();
    } else {
      this.cardForm.enable();
      this.cardForm.get('idleCDO').setValue(this.idleCDOs[0]);
      this.updateIdleCDO();
      this.updateAPR();
    }
    console.log('Idle CDOs left: ', this.idleCDOs);
  }

  updateIdleCDO() {
    this.cardForm
      .get('cardItem')
      .get('idleCDO')
      .setValue(this.cardForm.get('idleCDO').value);
  }

  updateAPR() {
    const cardItem = this.cardForm.get('cardItem').value;
    this.ps.getApr(cardItem.idleCDO, cardItem.exposure).then((v) => {
      this.apr = v;
    });
  }

  updateUnderlyingBalance() {
    this.ps.getUnderlyingBalance(this.cardForm.get('idleCDO').value).then((balance) => {
      this.underlyingBalance = balance;
    });
    this.cardForm.get('cardItem').get('amount').setValue('');
    this.cardForm.get('cardItem').get('exposure').setValue(50);
    this.updateAPR();
  }

  isNotEnoughAmount() {
    return Number(this.cardForm.get('cardItem').get('amount').value) <= 0;
  }

  isIdleCDOsEmpty() {
    return !this.idleCDOs || this.idleCDOs.length === 0;
  }

  isNotAbleToAddCardItem() {
    return this.isIdleCDOsEmpty() || this.isNotEnoughAmount();
  }

  isNotAbleToMint() {
    return this.cardItems.length === 0;
  }

}
