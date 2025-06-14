import { Component, inject } from '@angular/core';
import { MainService } from '../../services/main.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  imports: [ MatButtonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  mainService = inject(MainService);
  checklogin = this.mainService.loginUser;

  form = new FormGroup({
    login: new FormControl('', {
      validators: [Validators.required],
      asyncValidators: []
    }),
    password: new FormControl('', {
      validators: [Validators.minLength(6), Validators.required]
    }),
    repPassword: new FormControl('', {
      validators: [Validators.minLength(6), Validators.required]
    }),
  });

  get loginIsValid() {
    return this.form.controls.login.touched && this.form.controls.login.dirty && this.form.controls.login.invalid;
  }

  get passwordlIsValid() {
    const password = this.form.controls.password.touched && this.form.controls.password.dirty && this.form.controls.password.invalid;
    const repPassword = this.form.controls.repPassword.touched && this.form.controls.repPassword.dirty && this.form.controls.repPassword.invalid;
    return password && repPassword;
  }

  async onRgester() {
    if (!this.loginIsValid && !this.passwordlIsValid) {
      const result = await this.mainService.addUser({
        login: this.form.controls.login.value ?? '',
        password: this.form.controls.password.value ?? ''
      });
      if (result === true) {
        window.location.href = '/';
      }
    }
  }
}
