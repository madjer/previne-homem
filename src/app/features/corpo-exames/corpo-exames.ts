import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChicoAvatarComponent } from '../../shared/components/chico-avatar/chico-avatar';

@Component({
  standalone: true,
  selector: 'app-corpo-exames',
  imports: [RouterModule, ChicoAvatarComponent],
  template: `
  <div class="p-4 min-h-screen bg-gray-100">

    <app-chico-avatar frase="Conhecer seu corpo ajuda a prevenir problemas." ></app-chico-avatar>

    <h1 class="text-xl font-bold text-blue-900 mt-4 mb-4">
      Corpo e Exames
    </h1>

    <div class="bg-white p-4 rounded-xl shadow space-y-4 text-sm">

      <a routerLink="/higiene-intima" class="block border p-3 rounded-lg">
        Higiene íntima e prevenção
      </a>

      <div class="border p-3 rounded-lg">
        <h2 class="font-semibold text-blue-800">Pressão e coração</h2>
        <p>
          Medir a pressão com frequência ajuda a evitar problemas sérios.
        </p>
      </div>

      <div class="border p-3 rounded-lg">
        <h2 class="font-semibold text-blue-800">Açúcar no sangue</h2>
        <p>
          Diabetes pode não dar sintomas no começo. O exame é importante.
        </p>
      </div>

      <div class="border p-3 rounded-lg">
        <h2 class="font-semibold text-blue-800">Câncer de próstata</h2>
        <p>
          Após os 50 anos, é importante conversar com a UBS sobre exames.
        </p>
      </div>

      <a routerLink="/" class="block text-center text-blue-700 font-semibold">
        Voltar ao menu
      </a>
    </div>
  </div>
  `
})
export class CorpoExamesComponent {}
