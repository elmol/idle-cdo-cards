import { ChangeContext, PointerType } from '@angular-slider/ngx-slider';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Options } from 'ng5-slider/options';
import { CardService } from '../card-service/card.service';
import { CardForm } from '../types';

@Component({
  selector: 'app-card-create',
  templateUrl: './card-create.component.html',
  styleUrls: ['./card-create.component.scss']
})
export class CardCreateComponent {
  cardForm: FormGroup;
  exposure = 50;
  apr = 0.00;
  options: Options = {
    floor: 0,
    ceil: 100,
    hideLimitLabels: true,
    hidePointerLabels: true,
  };

  @Output() cardCreated: EventEmitter<CardForm> = new EventEmitter();


  constructor(private fb: FormBuilder, private ps: CardService) {
    this.cardForm = this.fb.group({
      exposure: this.fb.control('', [Validators.required]),
      amount: this.fb.control(''),
    });
  }

  submitForm() {
    const formData: CardForm = {
      exposure: this.cardForm.get('exposure').value,
      amount: this.cardForm.get('amount').value,
    };

    this.cardCreated.emit(formData);
  }

  onUserChange(changeContext: ChangeContext): void {
    this.ps.getApr(changeContext.value).then(v => this.apr = v);
  }

}
