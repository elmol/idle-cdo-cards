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
      exposure: this.fb.control('', [Validators.required]),
      amount: this.fb.control(''),
      idleCDO: this.fb.control(''),
    });
  }

  ngOnInit() {
    this.ps.getIdleCDOs().then((cdos) => {
      this.idleCDOs = cdos;
      this.cardForm.get('idleCDO').setValue(this.idleCDOs[0]);
    });
  }

  submitForm() {
    const formData: CardForm = {
      exposure: this.cardForm.get('exposure').value,
      amount: this.cardForm.get('amount').value,
      idleCDOAddress: this.cardForm.get('idleCDO').value.address,
    };

    this.cardCreated.emit(formData);
  }

  onUserChange(changeContext: ChangeContext): void {
    this.ps.getApr(this.cardForm.get('idleCDO').value,this.cardForm.get('exposure').value).then((v) => (this.apr = v));
  }

}
