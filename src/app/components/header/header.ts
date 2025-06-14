import { Component, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { MainService } from '../../services/main.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { LoginModal } from '../login-modal/login-modal';
import { Basket } from '../basket/basket';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  readonly dialog = inject(MatDialog);
  mainService = inject(MainService);
  userLoggedIn = computed(() => this.mainService.userLoggedIn());
  curUser = computed(() => this.mainService.curUser());
  count =  computed(() => this.mainService.getCountOfBasket());

  logout() {
    this.mainService.logout();
  }

  openLoginDialog(): void {
    this.dialog.open(LoginModal, {
      width: '350px',
    });
  } 

  openRegisterDialog(): void {
    window.location.href = '/register';
  }

  openBasketDialog(): void {
    console.log('Opening basket dialog');
    this.dialog.open(Basket, {
      width: '450px',
    });
  }
}
