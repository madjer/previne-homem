import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule, Location } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [RouterModule, CommonModule],
  template: `
  <div class="min-h-screen bg-blue-100 flex flex-col items-center pt-4">

  <!-- Header -->
  <div class="w-full flex justify-start pl-4">
    <img src="mascote2.png" class="w-16 absolute z-0" />
    <button
      (click)="voltar()"
      class="bg-white/80 text-blue-900 text-xs px-3 py-1 rounded-lg shadow active:scale-95 transition">
      Voltar
    </button>
  </div>
  <div class="w-full flex justify-end mr-4">
    <a
      routerLink="/perfil"
      class="bg-blue-400 mr-2 text-white text-sm px-4 py-1 rounded-lg shadow active:scale-95 transition">
     👨Perfil
    </a>
    <a
      (click)="logout()"
      class="bg-red-800 text-white text-sm px-4 py-1 rounded-lg shadow active:scale-95 transition">
      📤 Sair
    </a>
  </div>
  <!-- Bloco Chico + Frase -->
  <div class="relative w-full flex justify-end">

    <!-- Frase / citação -->

    <img src="seuchico.png" class="w-72 justify-end relative z-0 -mb-24" />
    <div class="absolute left-4 top-24 bg-white px-4 py-2 rounded-2xl shadow text-blue-900 text-sm font-semibold max-w-[180px]">
      “Cuidar de si também é coisa de homem.”
    </div>

  </div>

  <!-- Card Botões -->
  <div class="w-[calc(100%-25px)] bg-white max-h-[50vh] overflow-y-auto overscroll-contain rounded-3xl p-4 space-y-3 shadow-xl relative z-11 mt-12">
    <a routerLink="/checkup" class="menu-card">
      <span>👨‍⚕️ Meu Check-up</span>
      <span>›</span>
    </a>

    <a routerLink="/saude-sexual" class="menu-card">
      <span>❤️ Saúde Sexual</span>
      <span>›</span>
    </a>

    <a routerLink="/corpo-exames" class="menu-card">
      <span>🩺 Corpo em Dia</span>
      <span>›</span>
    </a>

    <a routerLink="/habitos" class="menu-card">
      <span>🏃 Hábitos Saudáveis</span>
      <span>›</span>
    </a>
    <a routerLink="/mente" class="menu-card">
      <span>🧠 Saúde Mental</span>
      <span>›</span>
    </a>
    <a routerLink="/higiene-intima" class="menu-card">
      <span>🛁 Higiene Íntima</span>
      <span>›</span>
    </a>
    <a routerLink="/duvidas" class="menu-card">
      <span>❓ Dúvidas Frequentes</span>
      <span>›</span>
    </a>
  </div>

</div>
  `
})
export class HomeComponent {

  logado = false;

  constructor(
    private authService: AuthService,
    private auth: Auth,
    private location: Location
  ) {
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

  voltar() {
    this.location.back();
  }
}
