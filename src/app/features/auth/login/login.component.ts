import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  form: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['user', Validators.required]
    });
  }

  login() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, password, role } = this.form.value;

    const user = this.auth.login(username, password, role);

    if (!user) {
      this.error = 'Invalid credentials or role';
      return;
    }
      this.router.navigate(['/home'])
  }

  get f() {
    return this.form.controls;
  }
}