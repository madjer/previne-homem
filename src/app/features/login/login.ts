import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  template: `
<div class="min-h-screen flex flex-col items-center bg-blue-200 px-6 pt-24">
  <img
    src="app_logo.png"
    alt="Previne Homem"
    class="w-64 h-64 mb-8 drop-shadow-lg"
  />
  <button
    (click)="login()"
    class="flex items-center gap-3 bg-white text-blue-900 px-6 py-3 rounded-xl shadow-md active:scale-95 transition mb-20"
  >
    <img src="google.svg" class="w-5 h-5" />
    Entrar com Google
  </button>

  <p class="text-black-800 text-center mb-2">
    Aplicativo desenvolvido para apresentação acadêmica de Rebecca Vieira Nogueira.
  </p>
</div>
  `
})
export class LoginComponent {
  constructor(private auth: AuthService) { }
  login() { this.auth.loginGoogle(); }
}
