import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
//   template: `
// <div class="min-h-screen flex flex-col items-center bg-blue-200 px-6 pt-24">
//   <img
//     src="app_logo.png"
//     alt="Previne Homem"
//     class="w-64 h-64 mb-8 drop-shadow-lg"
//   />
//   <button
//     (click)="login()"
//     class="flex items-center gap-3 bg-white text-blue-900 px-6 py-3 rounded-xl shadow-md active:scale-95 transition mb-20"
//   >
//     <img src="google.svg" class="w-5 h-5" />
//     Entrar com Google
//   </button>

//   <p class="text-black-800 text-center mb-2">
//     Aplicativo desenvolvido para apresentação acadêmica de Rebecca Vieira Nogueira.
//   </p>
// </div>
//   `,
  templateUrl: './login.html',
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';
  isIOS = false;
  isAndroid = false;
  isDesktop = false;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    const ua = navigator.userAgent || '';
    this.isIOS = /iPad|iPhone|iPod/.test(ua);
    this.isAndroid = /Android/.test(ua);
    this.isDesktop = !this.isIOS && !this.isAndroid;
  }

  loginWithEmailPassword() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Informe e-mail e senha.';
      return;
    }
    this.errorMessage = '';
    this.isLoading = true;
    this.auth.loginEmailPassword(this.email, this.password)
      .catch(() => {
        this.errorMessage = 'E-mail ou senha invalidos.';
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  registerWithEmailPassword() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Informe e-mail e senha.';
      return;
    }
    this.errorMessage = '';
    this.isLoading = true;
    this.auth.registerEmailPassword(this.email, this.password)
      .catch(() => {
        this.errorMessage = 'Nao foi possivel criar a conta.';
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  loginGoogle() { this.auth.loginGoogle(); }
}
