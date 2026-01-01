import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChicoAvatarComponent } from '../../../shared/components/chico-avatar/chico-avatar';

@Component({
  standalone: true,
  selector: 'app-higiene-intima',
  imports: [RouterModule, ChicoAvatarComponent],
  template: `
  <div class="p-4 min-h-screen bg-gray-100">

    <app-chico-avatar
      frase="Parceiro, cuidar da higiene íntima evita inflamações e doenças sérias."
    ></app-chico-avatar>

    <h1 class="text-xl font-bold text-blue-900 mt-4 mb-4">
      Câncer de pênis e higiene íntima
    </h1>

    <div class="bg-white p-4 rounded-xl shadow space-y-4 text-sm">

      <p>
        A falta de higiene adequada da região íntima pode causar inflamações,
        infecções repetidas e aumentar o risco de câncer de pênis.
      </p>

      <div>
        <h2 class="font-semibold text-blue-800 mb-2">Como fazer a higiene corretamente</h2>
        <ul class="list-disc pl-5 space-y-1">
          <li>Durante o banho, puxe a pele com cuidado para expor a região.</li>
          <li>Lave a área com água e sabonete neutro.</li>
          <li>Enxágue bem e seque com toalha limpa.</li>
          <li>Repita todos os dias e após relações.</li>
        </ul>
      </div>

      <div class="bg-red-100 p-3 rounded-lg">
        <h2 class="font-semibold text-red-700 mb-1">Procure a UBS se notar:</h2>
        <ul class="list-disc pl-5 text-red-700 space-y-1">
          <li>Feridas que não cicatrizam.</li>
          <li>Caroços, secreção ou mau cheiro.</li>
          <li>Dor ou sangramento.</li>
        </ul>
      </div>

      <button routerLink="/" class="w-full bg-blue-700 text-white p-3 rounded-xl">
        Entendi, vou cuidar melhor
      </button>
    </div>
  </div>
  `
})
export class HigieneIntimaComponent {}
