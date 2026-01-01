import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  template: `
  <div class="min-h-screen bg-blue-900 flex flex-col justify-center p-6 text-white text-center">
    <h1 class="text-2xl font-bold mb-6">Previne Homem</h1>
    <p class="mb-6">Entre com sua conta Google para continuar.</p>

    <button
      (click)="login()"
      class="bg-white text-blue-900 p-3 rounded-xl font-semibold">
      Entrar com Google
    </button>
  </div>
  `
})
export class LoginComponent {
  constructor(private auth: AuthService) {}
  login() { this.auth.loginGoogle(); }
}
