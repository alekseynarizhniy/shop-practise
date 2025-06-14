import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-login-modal',
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './login-modal.html',
  styleUrl: './login-modal.scss'
})
export class LoginModal {
  mainService = inject(MainService);
  checklogin = this.mainService.loginUser;
  readonly dialogRef = inject(MatDialogRef<LoginModal>);
  hide = signal(true);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  async onLogin(login: string, password: string) {
    try {
      const success = await this.mainService.loginUser({ login, password });
      if (success) {
        console.log('Login successful');
        this.mainService.userLoggedIn.set(true);
        this.dialogRef.close({ login, password });
      } else {
        console.error('Login failed');
        this.mainService.userLoggedIn.set(false);
      }
    } catch (err) {
      console.error('Login failed', err);
      this.mainService.userLoggedIn.set(false);
    }
  }
}
