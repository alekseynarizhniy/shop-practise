import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { smartphone } from '../../../../interfaces/smartphone.model';
import { MainService } from '../../../../services/main.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-card-detail',
  imports: [MatDialogModule, MatButtonModule, CurrencyPipe],
  templateUrl: './card-detail.html',
  styleUrls: ['./card-detail.scss']
})
export class CardDetail {
  mainService = inject(MainService);
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: smartphone) {}

  getSpecs() {
    return Object.entries(this.data?.specs);
  }

  onBuy() {
    this.mainService.addToBasket(this.data.id);
  }
}
