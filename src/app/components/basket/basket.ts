import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MainService } from '../../services/main.service';
import { MatTableModule } from '@angular/material/table';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-basket',
  imports: [MatButtonModule, MatTableModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, CurrencyPipe],
  templateUrl: './basket.html',
  styleUrl: './basket.scss'
})
export class Basket {
  mainService = inject(MainService);
  readonly dialogRef = inject(MatDialogRef<Basket>);
  displayedColumns: string[] = ['id', 'name', 'price', 'remove'];
  get usersBasket() { return this.mainService.curUser().basket; }
  get dataSource() {
    return this.mainService.smartphones().filter(phone => this.usersBasket.includes(phone.id));
  }

  totalPrice() {
    return this.dataSource.reduce((total, phone) => total + phone.price, 0);  
  }

  removeFromBasket(id: number) {
    this.mainService.removeFromBasket(id);
  }

  onBuy() {
    if(this.dataSource.length === 0) {
      this.dialogRef.close();
      return;
    }
    this.mainService.removeFromBasket(this.dataSource.map((phone) => phone.id));
    this.dialogRef.close();
  }
}
