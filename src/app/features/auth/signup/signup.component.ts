import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './signup.component.html'
})
export class SignupComponent {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4)]],
      role: ['user', Validators.required]
    });
  }

  signup() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.auth.signup(this.form.value);
    this.router.navigate(['/login']);
  }

  get f() {
    return this.form.controls;
  }
}