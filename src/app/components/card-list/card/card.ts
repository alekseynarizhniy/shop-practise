import { Component, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';

import { smartphone } from '../../../interfaces/smartphone.model';

import { CardDetail } from "./card-detail/card-detail";
import { MainService } from '../../../services/main.service';

@Component({
  selector: 'app-card',
  imports: [MatCardModule, MatButtonModule, CurrencyPipe],
  templateUrl: './card.html',
  styleUrl: './card.scss'
})
export class Card {
  smartphone = input<smartphone>();
  readonly dialog = inject(MatDialog);
  mainService = inject(MainService);

  onDetail() {
    const dialogRef = this.dialog.open(CardDetail, {
      data: this.smartphone(),
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  onBuy() {
      this.mainService.addToBasket(this.smartphone()!.id);
  }

}
