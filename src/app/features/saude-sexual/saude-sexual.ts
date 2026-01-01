import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChicoAvatarComponent } from '../../shared/components/chico-avatar/chico-avatar';

@Component({
  standalone: true,
  selector: 'app-saude-sexual',
  imports: [CommonModule, RouterModule, ChicoAvatarComponent],
  template: `
  <div class="p-4 min-h-screen bg-gray-100">

    <app-chico-avatar frase="Falar de saúde sexual é normal e importante."></app-chico-avatar>

    <h1 class="text-xl font-bold text-blue-900 mt-4 mb-4">
      Saúde Sexual Sem Tabu
    </h1>

    <div class="bg-white p-4 rounded-xl shadow space-y-4 text-sm">

      <div class="border p-3 rounded-lg">
        <h2 class="font-semibold text-blue-800">Mitos e Verdades</h2>
        <p class="mt-1">
          Dificuldades sexuais podem acontecer em qualquer fase da vida
          e não significam falta de masculinidade.
        </p>
      </div>

      <div class="border p-3 rounded-lg">
        <h2 class="font-semibold text-blue-800">Preservativo e ISTs</h2>
        <p>
          Usar preservativo ajuda a evitar infecções e protege você e sua parceria.
        </p>
      </div>

      <div class="bg-yellow-100 p-3 rounded-lg text-yellow-800">
        Caso perceba dor, desconforto ou alterações persistentes,
        é importante procurar a UBS para avaliação.
      </div>

      <a routerLink="/" class="block text-center text-blue-700 font-semibold">
        Voltar ao menu
      </a>
    </div>
  </div>
  `
})
export class SaudeSexualComponent {}
