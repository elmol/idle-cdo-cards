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
  underlyingBalanceFEI=0;


  exposure = 50;
  exposureFEI= 50;
  apr = 0.0;
  aprFEI = 0.0;
  options: Options = {
    floor: 0,
    ceil: 100,
    hideLimitLabels: true,
    hidePointerLabels: true,
  };
  idleCDOs;
  selectDisabled = 'disabled';
  disableMint = false;

  @Output() cardCreated: EventEmitter<CardForm[]> = new EventEmitter();

  constructor(private fb: FormBuilder, private ps: CardService) {
    this.cardForm = this.fb.group({
      idleCDO: this.fb.control(''),
      idleCDOFEI: this.fb.control(''),
      cardItem: this.fb.group({
        idleCDO: this.fb.control(''),
        exposure: this.fb.control('', [Validators.required]),
        amount: this.fb.control(''),
      }),
      cardItemFEI: this.fb.group({
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
      this.cardForm.get('idleCDOFEI').setValue(this.idleCDOs[1]);
      this.updateIdleCDO();
      this.updateAPR();
      this.updateUnderlyingBalance();
    });
        // TODO: emit other event type
        this.ps.onEvent('Transfer').subscribe(() => {
          this.updateUnderlyingBalance();
        });
  }

  submitForm() {
    const cardItem = this.cardForm.get('cardItem').value;
    const formData: CardForm = {
      exposure: cardItem.exposure,
      amount: cardItem.amount,
      idleCDOAddress: cardItem.idleCDO.address,
    };
    const cardItemFEI = this.cardForm.get('cardItemFEI').value;
    const formDataFEI: CardForm = {
      exposure: cardItemFEI.exposure,
      amount: cardItemFEI.amount,
      idleCDOAddress: cardItemFEI.idleCDO.address,
    };

    this.cardCreated.emit([formData, formDataFEI]);
  }

  onUserChange(changeContext: ChangeContext): void {
    this.updateIdleCDO();
    this.updateAPR();
  }

  updateIdleCDO () {
    this.cardForm.get('cardItem').get('idleCDO').setValue(this.cardForm.get('idleCDO').value);
    this.cardForm.get('cardItemFEI').get('idleCDO').setValue(this.cardForm.get('idleCDOFEI').value);
  }

  updateAPR() {
    const cardItem = this.cardForm.get('cardItem').value;
    this.ps.getApr(cardItem.idleCDO, cardItem.exposure).then((v) => {this.apr = v; this.disableMint = this.apr === 0 || this.isNotEnoughAmount();});

    const cardItemFEI = this.cardForm.get('cardItemFEI').value;
    this.ps.getApr(cardItemFEI.idleCDO, cardItemFEI.exposure).then((v) => {this.aprFEI = v; this.disableMint = this.aprFEI === 0 || this.isNotEnoughAmount();});
  }

  updateUnderlyingBalance() {
    this.ps.getUnderlyingBalance(this.idleCDOs[0]).then((balance) => {this.underlyingBalance = balance;});
    this.ps.getUnderlyingBalance(this.idleCDOs[1]).then((balance) => {this.underlyingBalanceFEI = balance;});
    this.cardForm.get('cardItem').get('amount').setValue("");
    this.cardForm.get('cardItemFEI').get('amount').setValue("");
    this.cardForm.get('cardItem').get('exposure').setValue(50);
    this.cardForm.get('cardItemFEI').get('exposure').setValue(50);
    this.updateAPR();
  }

  isNotEnoughAmount() {
    return Number(this.cardForm.get('cardItem').get('amount').value) <= 0 && Number(this.cardForm.get('cardItemFEI').get('amount').value) <= 0;
  }

}
