import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardService } from './card-service/card.service';
import { Web3Service } from './blockchain/web3.service';
import { CardCreateComponent } from './card-create/card-create.component';
import { CardComponent } from './card/card.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { CardGroupComponent } from './card-group/card-group.component';

@NgModule({
  declarations: [
    AppComponent,
    CardCreateComponent,
    CardComponent,
    CardGroupComponent,
  ],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, NgxSliderModule],
  providers: [CardService, Web3Service],
  bootstrap: [AppComponent],
})
export class AppModule {}
