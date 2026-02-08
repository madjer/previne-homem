import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChicoAvatarComponent } from '../../shared/components/chico-avatar/chico-avatar';
import { GamificationService } from '../../core/services/gamification';
import { NotificationComponent } from '../../shared/components/notification/notification';

@Component({
  standalone: true,
  selector: 'app-habitos',
  imports: [CommonModule, RouterModule, ChicoAvatarComponent, NotificationComponent],
  template: `
  <div class="p-4 min-h-screen bg-gray-100">

    <app-chico-avatar frase="Desafio da semana: mexer o corpo todo dia um pouquinho."></app-chico-avatar>

    <h1 class="text-xl font-bold text-blue-900 mt-4 mb-4">
      Hábitos de Vida
    </h1>

    <div class="bg-white p-4 rounded-xl shadow space-y-4 text-sm">
      <app-notification [message]="successMessage" type="success"></app-notification>

      <div class="bg-green-100 p-3 rounded-lg text-green-800">
        Pontos acumulados: <strong>{{ pontos }}</strong>
      </div>

      <div class="border p-3 rounded-lg">
        <h2 class="font-semibold text-blue-800">Desafio da semana</h2>
        <p>Caminhar por 10 minutos, 3 vezes na semana.</p>
        <button (click)="concluir()" class="mt-2 w-full bg-blue-700 text-white p-2 rounded">
          Concluí o desafio
        </button>
      </div>

      <div>
        <h2 class="font-semibold text-blue-800 mb-1">Dicas rápidas</h2>
        <ul class="list-disc pl-5 space-y-1">
          <li>Suba escadas sempre que puder.</li>
          <li>Beba água ao longo do dia.</li>
          <li>Tente dormir no mesmo horário.</li>
        </ul>
      </div>

      <a routerLink="/" class="block text-center text-blue-700 font-semibold">
        Voltar ao menu
      </a>
    </div>
  </div>
  `
})
export class HabitosComponent {

  pontos = 0;
  successMessage = '';

  constructor(private game: GamificationService) {
    this.pontos = this.game.pontos;
  }

  concluir() {
    this.game.add(10);
    this.pontos = this.game.pontos;
    this.successMessage = 'Parabens! Voce ganhou 10 pontos no Desafio do Cuidado!';
    setTimeout(() => {
      this.successMessage = '';
    }, 2500);
  }
}
