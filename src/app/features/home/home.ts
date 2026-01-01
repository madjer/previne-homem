import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { AuthService } from '../../core/services/auth.service';
import { ChicoAvatarComponent } from '../../shared/components/chico-avatar/chico-avatar';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [ChicoAvatarComponent, RouterModule, CommonModule],
  template: `
  <div class="min-h-screen bg-gray-100 p-4">

    <app-chico-avatar></app-chico-avatar>

    <button *ngIf="!logado"
      (click)="login()"
      class="bg-blue-700 text-white w-full p-3 rounded-xl mt-4">
      Entrar com Google
    </button>

    <button *ngIf="logado"
      (click)="logout()"
      class="bg-red-600 text-white w-full p-3 rounded-xl mt-4">
      Sair
    </button>

    <h1 class="text-xl font-bold text-blue-900 mt-4">
      Previne Homem
    </h1>

    <div class="grid grid-cols-2 gap-4 mt-6">
      <a routerLink="/checkup" class="menu-btn">Meu Check-up</a>
      <a routerLink="/corpo-exames" class="menu-btn">Corpo e Exames</a>
      <a routerLink="/saude-sexual" class="menu-btn">Saúde Sexual</a>
      <a routerLink="/mente" class="menu-btn">Mente e Emoções</a>
      <a routerLink="/habitos" class="menu-btn">Hábitos de Vida</a>
      <a routerLink="/duvidas" class="menu-btn">Dúvidas e UBS</a>
      <a routerLink="/higiene-intima" class="menu-btn">Higiene íntima</a>
    </div>
  </div>
  `
})
export class HomeComponent {

  logado = false;

  constructor(private authService: AuthService, private auth: Auth) {
    onAuthStateChanged(this.auth, user => {
      this.logado = !!user;
    });
  }

  login() {
    this.authService.loginGoogle();
  }

  logout() {
    this.authService.logout();
  }
}
